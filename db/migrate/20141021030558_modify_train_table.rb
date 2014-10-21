class ModifyTrainTable < ActiveRecord::Migration
  def change
    add_column :trains, :train_type, :integer
    add_column :trains, :direction, :string
  end
end
