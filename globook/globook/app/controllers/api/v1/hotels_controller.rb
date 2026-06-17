class Api::V1::HotelsController < Api::V1::ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show, :search]
 
  # GET /api/v1/hotels/search
  def search
    hotels = Hotel.where(active: true)
 
    hotels = hotels.where('LOWER(country) LIKE ?', "%#{params[:country].downcase}%") if params[:country].present?
    hotels = hotels.where('LOWER(city) LIKE ?', "%#{params[:city].downcase}%") if params[:city].present?
    hotels = hotels.where('LOWER(address) LIKE ?', "%#{params[:address].downcase}%") if params[:address].present?
    hotels = hotels.where('rating >= ?', params[:rating]) if params[:rating].present?
 
    if params[:room_type].present? || params[:price_from].present? || params[:price_to].present? || params[:amenities].present? || params[:room_name].present?
      hotels = hotels.joins(:rooms).distinct
      hotels = hotels.where(rooms: { room_type: params[:room_type] }) if params[:room_type].present?
      hotels = hotels.where('LOWER(rooms.room_number) LIKE ?', "%#{params[:room_name].downcase}%") if params[:room_name].present?
      hotels = hotels.where('rooms.price_per_night >= ?', params[:price_from]) if params[:price_from].present?
      hotels = hotels.where('rooms.price_per_night <= ?', params[:price_to]) if params[:price_to].present?
      if params[:amenities].present?
        Array(params[:amenities]).each do |amenity|
          hotels = hotels.where('rooms.amenities LIKE ?', "%#{amenity}%")
        end
      end
    end
 
    if params[:check_in].present? && params[:check_out].present?
      check_in  = Date.parse(params[:check_in])
      check_out = Date.parse(params[:check_out])
      busy_room_ids = Booking.where(status: ['Ожидает подтверждения', 'Подтверждено', 'Оплачено'])
                             .where('check_in_date < ? AND check_out_date > ?', check_out, check_in)
                             .pluck(:room_id)
      hotels = hotels.joins(:rooms).where.not(rooms: { id: busy_room_ids }).distinct
    end
 
    render json: hotels.map { |h| hotel_json(h) }
  end
 
  # GET /api/v1/hotels
  def index
    hotels = Hotel.where(active: true)
    render json: hotels.map { |h| hotel_json(h) }
  end
 
  # GET /api/v1/hotels/:id
  def show
    hotel = Hotel.includes(:rooms).find(params[:id])
    render json: hotel_detail_json(hotel)
  end
 
  # POST /api/v1/hotels
  def create
    require_permission!('create_hotel')
    hotel = Hotel.new(hotel_params)
    if hotel.save
      render json: hotel_json(hotel), status: :created
    else
      render json: { errors: hotel.errors.full_messages }, status: :unprocessable_entity
    end
  end
 
  # PATCH /api/v1/hotels/:id
  def update
    require_permission!('edit_hotel')
    hotel = Hotel.find(params[:id])
    if hotel.update(hotel_params)
      render json: hotel_json(hotel)
    else
      render json: { errors: hotel.errors.full_messages }, status: :unprocessable_entity
    end
  end
 
  # DELETE /api/v1/hotels/:id
  def destroy
    require_permission!('delete_hotel')
    hotel = Hotel.find(params[:id])
    hotel.update!(active: false)
    render json: { message: 'Отель деактивирован' }
  end
 
  private
 
  def hotel_params
    params.require(:hotel).permit(:name, :country, :city, :address, :description, :phone, :rating, :photo_url, :latitude, :longitude)
  end
 
  def hotel_json(hotel)
    {
      id: hotel.id,
      name: hotel.name,
      country: hotel.country || 'Россия',
      city: hotel.city || '',
      address: hotel.address,
      description: hotel.description,
      phone: hotel.phone || '+7 (000) 000-00-00',
      rating: hotel.rating.to_f,
      availableRooms: hotel.rooms.where(available: true).count,
      photo: hotel.photo_url || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
      latitude: hotel.latitude,
      longitude: hotel.longitude,
    }
  end
 
  def hotel_detail_json(hotel)
    hotel_json(hotel).merge(
      rooms: hotel.rooms.map { |r| room_json(r) }
    )
  end
 
  def room_json(r)
    {
      id: r.id,
      roomNumber: r.room_number,
      roomType: r.room_type,
      capacity: r.capacity,
      pricePerNight: r.price_per_night.to_i,
      amenities: r.amenities_array,
      available: r.available
    }
  end
end