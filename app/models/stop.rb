class Stop < ActiveRecord::Base
  validates :name, presence: true, length: {minimum: 1}
  has_many :time_locations
end
