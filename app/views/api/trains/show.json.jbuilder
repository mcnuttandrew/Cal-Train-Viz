json.(@train, :id, :train_type, :direction, :created_at, :updated_at)

time_stops = @train.time_locations
json.time_stops(time_stops) do |time_stop|
  js_time = :time.to_s #? DateTime.parse(:time.to_s) : :time
  json.(time_stop, js_time, :stop_id)
end