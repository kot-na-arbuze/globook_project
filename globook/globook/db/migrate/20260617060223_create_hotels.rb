class CreateHotels < ActiveRecord::Migration[7.1]
  def change
    create_table :hotels, id: :uuid do |t|
      t.string  :name,        null: false
      t.string  :country,     default: 'Россия'
      t.string  :city
      t.string  :address
      t.text    :description
      t.string  :phone
      t.decimal :rating,      precision: 3, scale: 1, default: 5.0
      t.string  :photo_url
      t.decimal :latitude,    precision: 10, scale: 7
      t.decimal :longitude,   precision: 10, scale: 7
      t.boolean :active,      default: true
      t.timestamps
    end
  end
end