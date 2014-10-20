class CreateTimeLocations < ActiveRecord::Migration
  def change
    create_table :time_locations do |t|
      t.integer :stop_id, null: false
      t.integer :train_id, null: false 
      t.timestamps
    end
  end
end
