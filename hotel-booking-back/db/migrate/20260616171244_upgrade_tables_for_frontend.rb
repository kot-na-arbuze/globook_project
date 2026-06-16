class UpgradeTablesForFrontend < ActiveRecord::Migration[8.1]
  def change
    # Корректируем отели (добавляем то, что просит страница поиска)
    add_column :hotels, :city, :string
    add_column :hotels, :phone, :string
    add_column :hotels, :rating, :decimal, precision: 3, scale: 1, default: 1.0

    # Корректируем пользователей (разбиваем name на ФИО + добавляем телефон и безопасный пароль)
    rename_column :users, :name, :first_name
    add_column :users, :last_name, :string
    add_column :users, :patronymic, :string
    add_column :users, :phone, :string
    add_column :users, :password_digest, :string # Поле для bcrypt (has_secure_password)
  end
end