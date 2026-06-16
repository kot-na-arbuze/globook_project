class CreateUsers < ActiveRecord::Migration[8.1]
  def change
    # Активируем расширение для работы с UUID (нужно сделать один раз в самой первой миграции)
    enable_extension 'pgcrypto' unless extension_enabled?('pgcrypto')

    create_table :users, id: :uuid do |t|
      t.string :user_type
      t.string :name
      t.string :email

      t.timestamps
    end
  end
end