class Api::V1::BookingsController < Api::V1::ApplicationController
  # Метод создания требует строго право 'book_room'
  before_action -> { require_permission!('book_room') }, only: [:create]

  # GET /api/v1/bookings
  def index
    # Получаем бронирования только текущего залогиненного пользователя
    @bookings = current_user.bookings.includes(:hotel, :room)
    
    # Форматируем JSON точно под структуру, которую ждет наш React-компонент BookingsList
    render json: @bookings.map { |b| {
      id: b.id,
      hotelName: b.hotel.name,
      country: b.hotel.country,
      city: b.hotel.city,
      address: b.hotel.address,
      description: b.hotel.description,
      phone: b.hotel.phone,
      rating: b.hotel.rating.to_f,
      photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500",
      roomName: "#{b.room.room_type} №#{b.room.room_number}",
      guestsCount: 2, # Можно расширить в БД при желании
      checkIn: b.check_in_date,
      checkOut: b.check_out_date,
      pricePerNight: b.room.respond_to?(:price_per_night) ? b.room.price_per_night.to_i : 5000,
      status: b.status
    }}
  end

  # POST /api/v1/bookings
  def create
    room = Room.find(booking_params[:room_id])
    check_in = Date.parse(booking_params[:check_in_date])
    check_out = Date.parse(booking_params[:check_out_date])

    # Защита от Double-Booking (Алгоритм пересечения отрезков дат)
    overlapping = Booking.where(room_id: room.id, status: ['Ожидает подтверждения', 'Подтверждено'])
                         .where('check_in_date < ? AND check_out_date > ?', check_out, check_in)

    if overlapping.exists?
      return render json: { error: 'Этот номер уже забронирован на выбранные даты!' }, status: :conflict
    end

    # Расчет стоимости
    nights = (check_out - check_in).to_i
    nights = 1 if nights <= 0
    price_per_night = room.respond_to?(:price_per_night) ? room.price_per_night : 4500
    total_price = nights * price_per_night

    # Создаем бронирование, привязанное к текущему пользователю сессии
    @booking = current_user.bookings.new(booking_params)
    @booking.hotel_id = room.hotel_id
    @booking.total_price = total_price
    @booking.status = 'Ожидает подтверждения' # Дефолтный статус по ТЗ

    if @booking.save
      render json: { message: 'Номер успешно забронирован', booking: @booking }, status: :created
    else
      render json: { errors: @booking.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # POST /api/v1/bookings/:id/cancel
  def cancel
    @booking = Booking.find(params[:id])

    # Отменить может либо сам владелец брони, либо менеджер/админ с глобальным правом
    if @booking.user_id == current_user.id || current_user.can?('cancel_booking')
      @booking.update!(status: 'Отменено')
      render json: { message: 'Бронирование успешно отменено', booking: @booking }
    else
      render json: { error: 'У вас нет прав для отмены этого бронирования' }, status: :forbidden
    end
  end

  private

  def booking_params
    params.require(:booking).permit(:room_id, :check_in_date, :check_out_date)
  end
end