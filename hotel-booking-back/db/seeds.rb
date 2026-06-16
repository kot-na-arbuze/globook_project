# 1. Создаем разрешения из технического задания
permissions_list = [
  { key: 'create_role_type', description: 'Создание типов аккаунта' },
  { key: 'delete_role_type', description: 'Удаление типов аккаунта' },
  { key: 'edit_role_permissions', description: 'Изменение разрешений ролей' },
  { key: 'create_account', description: 'Создание аккаунта' },
  { key: 'delete_account', description: 'Удаление аккаунта' },
  { key: 'edit_account_variables', description: 'Изменение переменных аккаунта' },
  { key: 'create_hotel', description: 'Создание отеля' },
  { key: 'delete_hotel', description: 'Удаление отеля' },
  { key: 'create_room', description: 'Создание комнат' },
  { key: 'delete_room', description: 'Удаление комнат' },
  { key: 'book_room', description: 'Бронирование комнат' },
  { key: 'pay_booking', description: 'Оплата бронирования' },
  { key: 'cancel_booking', description: 'Отмена бронирования' },
  { key: 'view_directories', description: 'Просмотр списков отелей/комнат/бронирований' },
  { key: 'refund_payment', description: 'Оформление возврата средств' },
  { key: 'moderate_reviews', description: 'Модерация отзывов' },
  { key: 'view_personal_data', description: 'Просмотр персональных данных' }
]

created_perms = {}
permissions_list.each do |p|
  created_perms[p[:key]] = Permission.find_or_create_by!(key: p[:key], description: p[:description])
end

# 2. Создаем роли
admin_role   = Role.find_or_create_by!(name: 'Администратор', description: 'Полный доступ к системе')
manager_role = Role.find_or_create_by!(name: 'Менеджер', description: 'Управление отелями и бронированиями')
client_role  = Role.find_or_create_by!(name: 'Клиент', description: 'Поиск и бронирование номеров')

# 3. Привязываем права к ролям
# Администратор получает абсолютно всё
admin_role.permissions = Permission.all

# Менеджер
manager_role.permissions = [
  created_perms['create_room'], created_perms['delete_room'],
  created_perms['cancel_booking'], created_perms['view_directories']
]

# Клиент
client_role.permissions = [
  created_perms['book_room'], created_perms['pay_booking'], 
  created_perms['cancel_booking'], created_perms['view_directories']
]

puts "🔒 RBAC успешно инициализирован!"