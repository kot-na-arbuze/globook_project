class CreatePermissions < ActiveRecord::Migration[7.1]
  def change
    create_table :permissions, id: :uuid do |t|
      t.string :key, null: false
      t.string :description
      t.timestamps
    end
    add_index :permissions, :key, unique: true
  end
end