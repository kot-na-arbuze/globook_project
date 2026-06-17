class CreateRooms < ActiveRecord::Migration[7.1]
  def change
    create_table :rooms, id: :uuid do |t|
      t.references :hotel,       null: false, foreign_key: true, type: :uuid
      t.string  :room_number,    null: false
      t.string  :room_type,      null: false  # single, double, suite
      t.integer :capacity,       default: 2
      t.decimal :price_per_night, precision: 10, scale: 2, default: 4500.0
      t.text    :amenities       # JSON-строка: "Wi-Fi,Бассейн,Парковка"
      t.boolean :available,      default: true
      t.timestamps
    end
    add_index :rooms, [:hotel_id, :room_number], unique: true
  end
end