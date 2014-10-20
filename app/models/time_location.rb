class TimeLocation < ActiveRecord::Base
  validates :stop_id, presence: true
  validates :train_id, presence: true
  
  belongs_to :stop
  belongs_to :train
end
