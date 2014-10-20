class Train < ActiveRecord::Base
  validates :id_number, presence: true
  
  has_many :time_locations
  
end
