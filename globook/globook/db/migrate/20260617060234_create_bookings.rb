class CreateBookings < ActiveRecord::Migration[7.1]
  def change
    create_table :bookings, id: :uuid do |t|
      t.references :user,  null: false, foreign_key: true, type: :uuid
      t.references :room,  null: false, foreign_key: true, type: :uuid
      t.references :hotel, null: false, foreign_key: true, type: :uuid
      t.date    :check_in_date,  null: false
      t.date    :check_out_date, null: false
      t.decimal :total_price,    precision: 10, scale: 2
      t.string  :status,         default: 'Ожидает подтверждения'
      # Статусы: 'Ожидает подтверждения', 'Подтверждено', 'Оплачено', 'Отменено', 'Завершено'
      t.string  :payment_method
      t.datetime :paid_at
      t.integer :guests_count, default: 1
      t.text    :special_requests
      t.timestamps
    end
  end
end