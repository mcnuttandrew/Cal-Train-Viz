class CreateStops < ActiveRecord::Migration
  def change
    create_table :stops do |t|
      t.string :name, unique: true
      t.timestamps
    end
  end
end
