require 'json'

times = []
File.open("db/cal_train_times.json", "r") do |f|
  times = JSON.load(f)
end

stops = []
File.open("db/cal_train_stops.json", "r") do |f|
  stops = JSON.load(f)
end

train_numbers = times.keys
train_numbers.each do |train|
  cur_train = Train.create!({id_number: train})
  train_times = times[train]
  train_times.each do |stop_id, time|
    TimeLocation.create!({
                          stop_id: stop_id, 
                          train_id: cur_train.id, 
                          time: time 
                          })
  end
end

stops.keys.reverse.each do |stop|
  Stop.create!({name: stops[stop]})
end
