class AddTimeToTimeLocations < ActiveRecord::Migration
  def change
    add_column :time_locations, :time, :time  
  end
end
