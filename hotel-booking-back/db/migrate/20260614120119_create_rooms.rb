class CreateRooms < ActiveRecord::Migration[8.1]
  def change
    create_table :rooms, id: :uuid do |t|
      t.references :hotel, type: :uuid, null: false, foreign_key: true
      t.string :room_number
      t.string :room_type

      t.timestamps
    end
  end
end