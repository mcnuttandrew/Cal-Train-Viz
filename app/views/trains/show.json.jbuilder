json.(@train, :id, :created_at, :updated_at)

time_stops = @train.time_locations
json.time_stops(time_stops) do |time_stop|
  json.(time_stop, :time, :stop_id)
end