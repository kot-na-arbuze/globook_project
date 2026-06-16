class Api::V1::HotelsController < Api::V1::ApplicationController
  # Искать и просматривать отели можно без авторизации сессии
  skip_before_action :authenticate_user!, only: [:index, :show, :search]

  # GET /api/v1/hotels/search
  def search
    # Начинаем с выборки всех отелей
    hotels = Hotel.all

    # 1. Фильтрация по гео-данным и рейтингу (Таблица отелей)
    hotels = hotels.where('LOWER(country) LIKE ?', "%#{params[:country].downcase}%") if params[:country].present?
    hotels = hotels.where('LOWER(city) LIKE ?', "%#{params[:city].downcase}%") if params[:city].present?
    hotels = hotels.where('LOWER(address) LIKE ?', "%#{params[:address].downcase}%") if params[:address].present?
    hotels = hotels.where('rating >= ?', params[:rating]) if params[:rating].present?

    # 2. Фильтрация по параметрам номеров (Используем SQL JOIN к таблице rooms)
    if params[:room_type].present? || params[:price_from].present? || params[:price_to].present? || params[:amenities].present? || params[:room_name].present?
      hotels = hotels.joins(:rooms).distinct
      
      hotels = hotels.where(rooms: { room_type: params[:room_type] }) if params[:room_type].present?
      hotels = hotels.where('LOWER(rooms.room_number) LIKE ?', "%#{params[:room_name].downcase}%") if params[:room_name].present?
      
      # Фильтры цен (если добавили поле price_per_night в таблицу rooms)
      hotels = hotels.where('rooms.price_per_night >= ?', params[:price_from]) if params[:price_from].present?
      hotels = hotels.where('rooms.price_per_night <= ?', params[:price_to]) if params[:price_to].present?
      
      # Поиск по удобствам (предполагаем, что они лежат строкой вроде "Wi-Fi, Бассейн")
      if params[:amenities].present?
        Array(params[:amenities]).each do |amenity|
          hotels = hotels.where('rooms.amenities LIKE ?', "%#{amenity}%")
        end
      end
    end

    # 3. Фильтр по датам: убираем отели, где ВСЕ комнаты заняты на эти даты
    if params[:check_in].present? && params[:check_out].present?
      check_in = Date.parse(params[:check_in])
      check_out = Date.parse(params[:check_out])

      # Находим ID всех комнат, которые заняты в этот период
      busy_room_ids = Booking.where(status: ['Ожидает подтверждения', 'Подтверждено'])
                             .where('check_in_date < ? AND check_out_date > ?', check_out, check_in)
                             .pluck(:room_id)

      # Оставляем только те отели, у которых есть хотя бы одна комната, НЕ входящая в список занятых
      hotels = hotels.joins(:rooms).where.not(rooms: { id: busy_room_ids }).distinct
    end

    # Маппим результат в формат camelCase под React-карточку HotelCard
    render json: hotels.map { |h| {
      id: h.id,
      name: h.name,
      country: h.country || 'Россия',
      city: h.city || 'Москва',
      address: h.address,
      description: h.description,
      phone: h.phone || '+7 (000) 000-00-00',
      rating: h.rating.to_f,
      availableRooms: h.respond_to?(:rooms) ? h.rooms.count : 3, # Имитация или реальный каунт
      photo: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=500"
    }}
  end

  # GET /api/v1/hotels/:id
  def show
    hotel = Hotel.find(params[:id])
    render json: hotel.as_json(include: :rooms)
  end
end