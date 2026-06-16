class CreateBookings < ActiveRecord::Migration[8.1]
  def change
    create_table :bookings, id: :uuid do |t|
      t.references :user, type: :uuid, null: false, foreign_key: true
      t.references :hotel, type: :uuid, null: false, foreign_key: true
      t.references :room, type: :uuid, null: false, foreign_key: true
      t.string :status
      t.date :check_in_date
      t.date :check_out_date
      t.decimal :total_price, precision: 10, scale: 2

      t.timestamps
    end
  end
end