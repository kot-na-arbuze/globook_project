# db/seeds.rb
# Запуск: rails db:seed
# Очистка + пересев: rails db:seed:replant (Rails 6+) или rails db:drop db:create db:migrate db:seed

puts "=== Очистка старых данных ==="
Booking.destroy_all
Room.destroy_all
Hotel.destroy_all
RolePermission.destroy_all
Permission.destroy_all
User.destroy_all
Role.destroy_all

puts "=== Создание прав доступа (Permissions) ==="
permissions_data = [
  # Просмотр
  { key: 'view_hotels',         description: 'Просмотр списка отелей' },
  { key: 'view_hotel_page',     description: 'Просмотр страницы отеля' },
  { key: 'view_directories',    description: 'Просмотр системных реестров' },
  { key: 'view_personal_data',  description: 'Просмотр персональных данных (ФЗ-152)' },

  # Клиентские права
  { key: 'book_room',           description: 'Бронирование номера' },
  { key: 'pay_booking',         description: 'Оплата бронирования' },
  { key: 'cancel_booking',      description: 'Отмена собственного бронирования' },

  # Менеджерские права
  { key: 'edit_booking',        description: 'Редактирование любого бронирования' },
  { key: 'edit_hotel',          description: 'Редактирование информации об отеле' },
  { key: 'view_all_bookings',   description: 'Просмотр всех бронирований' },
  { key: 'create_room',         description: 'Добавление номера в отель' },
  { key: 'delete_room',         description: 'Удаление номера отеля' },
  { key: 'moderate_reviews',    description: 'Модерация отзывов' },
  { key: 'refund_payment',      description: 'Возврат платежа' },

  # Административные права
  { key: 'create_hotel',        description: 'Добавление нового отеля' },
  { key: 'delete_hotel',        description: 'Удаление отеля' },
  { key: 'create_hotels_bulk',  description: 'Массовый импорт отелей' },
  { key: 'create_account',      description: 'Создание аккаунта' },
  { key: 'delete_account',      description: 'Удаление аккаунта' },
  { key: 'edit_account_variables', description: 'Редактирование параметров аккаунта' },
  { key: 'create_role_type',    description: 'Создание типа роли' },
  { key: 'delete_role_type',    description: 'Удаление типа роли' },
  { key: 'edit_role_permissions', description: 'Изменение разрешений роли' },
]

permissions = permissions_data.map { |p| Permission.create!(p) }
perm = permissions.index_by(&:key)

puts "=== Создание ролей ==="
role_client = Role.create!(name: 'Клиент')
role_manager = Role.create!(name: 'Менеджер')
role_admin = Role.create!(name: 'Администратор')

puts "=== Назначение прав ролям ==="
# Клиент
client_permissions = %w[view_hotels view_hotel_page book_room pay_booking cancel_booking]
client_permissions.each { |key| RolePermission.create!(role: role_client, permission: perm[key]) }

# Менеджер = клиент + управление отелями/бронями
manager_permissions = client_permissions + %w[
  edit_booking edit_hotel view_all_bookings
  create_room delete_room moderate_reviews refund_payment
  view_directories view_personal_data
]
manager_permissions.each { |key| RolePermission.create!(role: role_manager, permission: perm[key]) }

# Администратор = все права
permissions.each { |p| RolePermission.create!(role: role_admin, permission: p) }

puts "=== Создание тестовых пользователей ==="
admin = User.create!(
  email: 'admin@globook.ru',
  password: 'admin123',
  first_name: 'Александр',
  last_name: 'Иванов',
  patronymic: 'Петрович',
  phone: '+7 (999) 000-00-01',
  role: role_admin
)

manager = User.create!(
  email: 'manager@globook.ru',
  password: 'manager123',
  first_name: 'Мария',
  last_name: 'Смирнова',
  patronymic: 'Андреевна',
  phone: '+7 (999) 000-00-02',
  role: role_manager
)

client = User.create!(
  email: 'client@globook.ru',
  password: 'client123',
  first_name: 'Дмитрий',
  last_name: 'Козлов',
  patronymic: 'Владимирович',
  phone: '+7 (999) 000-00-03',
  role: role_client
)

puts "=== Создание отелей ==="
hotels_data = [
  {
    name: 'Гранд Москва',
    country: 'Россия', city: 'Москва', address: 'ул. Тверская, 1',
    description: 'Элегантный пятизвёздочный отель в самом центре столицы. Панорамный вид на Кремль, спа-центр мирового класса.',
    phone: '+7 (495) 100-10-01', rating: 9.2,
    photo_url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800',
    latitude: 55.7558, longitude: 37.6173
  },
  {
    name: 'Санкт-Петербург Палас',
    country: 'Россия', city: 'Санкт-Петербург', address: 'Невский просп., 57',
    description: 'Исторический отель в стиле русского ампира. Рядом с Эрмитажем и Русским музеем.',
    phone: '+7 (812) 200-20-02', rating: 8.7,
    photo_url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800',
    latitude: 59.9311, longitude: 30.3609
  },
  {
    name: 'Сочи Riviera',
    country: 'Россия', city: 'Сочи', address: 'ул. Морская, 15',
    description: 'Курортный отель на Черноморском побережье. Бассейн с видом на море, собственный пляж.',
    phone: '+7 (862) 300-30-03', rating: 8.4,
    photo_url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800',
    latitude: 43.5855, longitude: 39.7231
  },
  {
    name: 'Казань Татарстан',
    country: 'Россия', city: 'Казань', address: 'ул. Баумана, 9',
    description: 'Современный бизнес-отель в сердце Казани. Идеален для деловых поездок и туризма.',
    phone: '+7 (843) 400-40-04', rating: 8.1,
    photo_url: 'https://images.unsplash.com/photo-1444201983204-c43cbd584d93?w=800',
    latitude: 55.7887, longitude: 49.1221
  },
  {
    name: 'Байкал Резорт',
    country: 'Россия', city: 'Иркутск', address: 'пос. Листвянка, д. 1',
    description: 'Эко-отель на берегу озера Байкал. Потрясающие закаты, рыбалка, пешие маршруты.',
    phone: '+7 (395) 500-50-05', rating: 9.0,
    photo_url: 'https://images.unsplash.com/photo-1586611292717-f828b167408c?w=800',
    latitude: 51.8517, longitude: 104.8640
  },
  {
    name: 'Екатеринбург Хайатт',
    country: 'Россия', city: 'Екатеринбург', address: 'пр. Ленина, 40',
    description: 'Международная сеть в Уральской столице. Конференц-залы, ресторан с авторской кухней.',
    phone: '+7 (343) 600-60-06', rating: 8.6,
    photo_url: 'https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=800',
    latitude: 56.8389, longitude: 60.6057
  },
]

hotels = hotels_data.map { |h| Hotel.create!(h) }

puts "=== Создание номеров ==="
room_types = [
  { room_type: 'single', capacity: 1, price_per_night: 3500 },
  { room_type: 'double', capacity: 2, price_per_night: 5500 },
  { room_type: 'suite',  capacity: 4, price_per_night: 12000 },
]
amenities_pool = ['Wi-Fi', 'Кондиционер', 'Телевизор', 'Мини-бар', 'Сейф', 'Завтрак', 'Парковка', 'Бассейн']

hotels.each_with_index do |hotel, hi|
  8.times do |i|
    rt = room_types[i % 3]
    amenities_subset = amenities_pool.sample(rand(3..6)).join(',')
    Room.create!(
      hotel: hotel,
      room_number: "#{(hi + 1) * 100 + i + 1}",
      room_type: rt[:room_type],
      capacity: rt[:capacity],
      price_per_night: rt[:price_per_night] + rand(-500..1000),
      amenities: amenities_subset,
      available: true
    )
  end
end

puts "=== Создание тестовых бронирований ==="
room1 = hotels.first.rooms.first
room2 = hotels.second.rooms.second

Booking.create!(
  user: client, room: room1, hotel: hotels.first,
  check_in_date: Date.today + 5,
  check_out_date: Date.today + 8,
  total_price: room1.price_per_night * 3,
  status: 'Подтверждено',
  guests_count: 2
)

Booking.create!(
  user: client, room: room2, hotel: hotels.second,
  check_in_date: Date.today + 15,
  check_out_date: Date.today + 18,
  total_price: room2.price_per_night * 3,
  status: 'Ожидает подтверждения',
  guests_count: 1
)

puts ""
puts "✅ Seed завершён!"
puts "   admin@globook.ru    / admin123"
puts "   manager@globook.ru  / manager123"
puts "   client@globook.ru   / client123"
