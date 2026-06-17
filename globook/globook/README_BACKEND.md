    # 1. Установка зависимостей
    bundle install
    
    # 2. Настройка БД (config/database.yml)
    # development:
    #   adapter: postgresql
    #   database: globook_development
    #   username: postgres
    #   password: your_password
    #   host: localhost
    
    # 3. Создание и миграция БД
    rails db:create
    rails db:migrate
    rails db:seed
    
    # 4. Запуск сервера (на порту 3000)
    rails s -p 3000
    
    # Тестовые аккаунты:
    # admin@globook.ru    / admin123   (Администратор)
    # manager@globook.ru  / manager123 (Менеджер)
    # client@globook.ru   / client123  (Клиент)
