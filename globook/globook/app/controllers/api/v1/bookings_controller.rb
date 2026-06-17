class Api::V1::BookingsController < Api::V1::ApplicationController
 
  # GET /api/v1/bookings — брони текущего пользователя
  def index
    bookings = current_user.bookings.includes(:hotel, :room).order(created_at: :desc)
    render json: bookings.map { |b| booking_json(b) }
  end
 
  # GET /api/v1/bookings/all — ВСЕ брони (для менеджеров)
  def all
    require_permission!('view_all_bookings')
    bookings = Booking.includes(:hotel, :room, :user).order(created_at: :desc)
    render json: bookings.map { |b| booking_json(b, include_user: true) }
  end
 
  # GET /api/v1/bookings/:id
  def show
    booking = find_accessible_booking
    render json: booking_json(booking)
  end
 
  # POST /api/v1/bookings
  def create
    require_permission!('book_room')
 
    room = Room.find(booking_params[:room_id])
    check_in  = Date.parse(booking_params[:check_in_date])
    check_out = Date.parse(booking_params[:check_out_date])
 
    if check_out <= check_in
      return render json: { error: 'Дата выезда должна быть позже даты заезда' }, status: :unprocessable_entity
    end
 
    # Защита от Double-Booking
    overlapping = Booking.where(room_id: room.id, status: ['Ожидает подтверждения', 'Подтверждено', 'Оплачено'])
                         .where('check_in_date < ? AND check_out_date > ?', check_out, check_in)
    if overlapping.exists?
      return render json: { error: 'Номер уже забронирован на указанные даты!' }, status: :conflict
    end
 
    nights = (check_out - check_in).to_i
    total_price = nights * room.price_per_night
 
    booking = current_user.bookings.new(
      room: room,
      hotel: room.hotel,
      check_in_date: check_in,
      check_out_date: check_out,
      total_price: total_price,
      status: 'Ожидает подтверждения',
      guests_count: params[:booking][:guests_count] || 1,
      special_requests: params[:booking][:special_requests]
    )
 
    if booking.save
      render json: booking_json(booking), status: :created
    else
      render json: { errors: booking.errors.full_messages }, status: :unprocessable_entity
    end
  end
 
  # PATCH /api/v1/bookings/:id — редактирование (менеджер)
  def update
    require_permission!('edit_booking')
    booking = Booking.find(params[:id])
    if booking.update(manager_update_params)
      render json: booking_json(booking)
    else
      render json: { errors: booking.errors.full_messages }, status: :unprocessable_entity
    end
  end
 
  # POST /api/v1/bookings/:id/cancel
  def cancel
    booking = find_accessible_booking
    if booking.status == 'Оплачено' && !current_user.can?('refund_payment')
      return render json: { error: 'Для отмены оплаченного бронирования требуются права менеджера' }, status: :forbidden
    end
    booking.update!(status: 'Отменено')
    render json: { message: 'Бронирование отменено', booking: booking_json(booking) }
  end
 
  # POST /api/v1/bookings/:id/confirm — подтверждение (менеджер)
  def confirm
    require_permission!('edit_booking')
    booking = Booking.find(params[:id])
    booking.update!(status: 'Подтверждено')
    render json: { message: 'Бронирование подтверждено', booking: booking_json(booking) }
  end
 
  # POST /api/v1/bookings/:id/pay — оплата (клиент)
  def pay
    require_permission!('pay_booking')
    booking = current_user.bookings.find(params[:id])
 
    if booking.status == 'Оплачено'
      return render json: { error: 'Бронирование уже оплачено' }, status: :unprocessable_entity
    end
    if booking.status == 'Отменено'
      return render json: { error: 'Нельзя оплатить отменённое бронирование' }, status: :unprocessable_entity
    end
 
    booking.update!(
      status: 'Оплачено',
      payment_method: params[:payment_method] || 'card',
      paid_at: Time.current
    )
    render json: { message: 'Оплата прошла успешно', booking: booking_json(booking) }
  end
 
  private
 
  def find_accessible_booking
    if current_user.can?('edit_booking')
      Booking.find(params[:id])
    else
      current_user.bookings.find(params[:id])
    end
  end
 
  def booking_params
    params.require(:booking).permit(:room_id, :check_in_date, :check_out_date, :guests_count, :special_requests)
  end
 
  def manager_update_params
    params.require(:booking).permit(:check_in_date, :check_out_date, :status, :guests_count, :special_requests)
  end
 
  def booking_json(booking, include_user: false)
    result = {
      id: booking.id,
      hotelName: booking.hotel.name,
      hotelId: booking.hotel_id,
      country: booking.hotel.country,
      city: booking.hotel.city,
      address: booking.hotel.address,
      description: booking.hotel.description,
      phone: booking.hotel.phone,
      rating: booking.hotel.rating.to_f,
      photo: booking.hotel.photo_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      roomName: "#{booking.room.room_type} №#{booking.room.room_number}",
      roomId: booking.room_id,
      roomType: booking.room.room_type,
      guestsCount: booking.guests_count,
      checkIn: booking.check_in_date,
      checkOut: booking.check_out_date,
      pricePerNight: booking.room.price_per_night.to_i,
      totalPrice: booking.total_price.to_i,
      status: booking.status,
      paymentMethod: booking.payment_method,
      paidAt: booking.paid_at,
      specialRequests: booking.special_requests,
      createdAt: booking.created_at.strftime("%d.%m.%Y")
    }
    result[:user] = { id: booking.user_id, fullName: booking.user.full_name, email: booking.user.email } if include_user
    result
  end
end