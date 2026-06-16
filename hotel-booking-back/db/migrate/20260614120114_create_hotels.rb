class CreateHotels < ActiveRecord::Migration[8.1]
  def change
    create_table :hotels, id: :uuid do |t|
      # указываем type: :uuid, так как менеджер — это User, у которого теперь UUID
      t.references :manager, type: :uuid, null: false, foreign_key: { to_table: :users }
      t.string :name
      t.text :description
      t.string :address
      
      # Вот тут мы руками дописываем точность для координат
      t.decimal :lat, precision: 10, scale: 6
      t.decimal :lng, precision: 10, scale: 6

      t.timestamps
    end
  end
end