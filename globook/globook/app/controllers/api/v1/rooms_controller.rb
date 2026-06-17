class Api::V1::RoomsController < Api::V1::ApplicationController
  skip_before_action :authenticate_user!, only: [:index, :show]
 
  def index
    hotel = Hotel.find(params[:hotel_id])
    render json: hotel.rooms.map { |r| room_json(r) }
  end
 
  def show
    room = Room.find(params[:id])
    render json: room_json(room)
  end
 
  def create
    require_permission!('create_room')
    hotel = Hotel.find(params[:hotel_id])
    room = hotel.rooms.new(room_params)
    if room.save
      render json: room_json(room), status: :created
    else
      render json: { errors: room.errors.full_messages }, status: :unprocessable_entity
    end
  end
 
  def update
    require_permission!('edit_hotel')
    room = Room.find(params[:id])
    if room.update(room_params)
      render json: room_json(room)
    else
      render json: { errors: room.errors.full_messages }, status: :unprocessable_entity
    end
  end
 
  def destroy
    require_permission!('delete_room')
    room = Room.find(params[:id])
    room.destroy
    render json: { message: 'Номер удалён' }
  end
 
  private
 
  def room_params
    params.require(:room).permit(:room_number, :room_type, :capacity, :price_per_night, :amenities, :available)
  end
 
  def room_json(r)
    {
      id: r.id,
      hotelId: r.hotel_id,
      roomNumber: r.room_number,
      roomType: r.room_type,
      capacity: r.capacity,
      pricePerNight: r.price_per_night.to_i,
      amenities: r.amenities_array,
      available: r.available
    }
  end
end