#data acquired from CAL TRAN website
require 'nokogiri'
require 'open-uri'
require 'json'

def get_train_times(rows)
  tabs = []
  rows[0].css('tr').each do |row|
    result = []
    row.children.each do |col|
      result << col.children.text.strip
    end
    tabs << result
  end
  #flip table
  #get col headers
  trains = []
  tabs[0].each_with_index do |train, index|
    trains << [train]
  end
  #fill out each one
  north_bound = (tabs[0].include?("Northbound Train No.") ? true : false)
  
  tabs[1..(-1)].each_with_index do |row, kndex|
    row.each_with_index do |time, index|
      mtime = time
      if index > row.length/2
        temp = [];
        if time.split(":").length > 1
          temp = time.split(":")
          temp[0] = (temp[0].to_i + 12).to_s;
          mtime = temp.join(":")
          puts mtime
        end
      end
      trains[index] << (north_bound ? [28-kndex, mtime] : [kndex, mtime])
      
    end
  end
  #filter 
  stops = trains.select do |train|
    train[0].length > 4
  end
  
  trains.select! do |train| 
    !(train[0].length < 1 || train[0].length >4 || train[0]=="Zone")
  end
  
  [trains, stops]
end


#get table
train_table = 'http://www.caltrain.com/schedules/weekdaytimetable.html'
doc = Nokogiri::HTML(open(train_table))
nb_data = get_train_times(doc.css(".NB_TT"))
north_bound_trains = nb_data[0]
# south_bound_trains = nb_data[0]

trains = north_bound_trains#.concat(south_bound_trains)
stops = nb_data[1]
#hash-ify
trains_hash = {}
trains.each do |train|
  trains_hash[train[0]] = train[1..(-1)]
end

stops_hash = {}
stops[0][1..-1].each_with_index do |stop, index|
  stops_hash[stop[0]] = stop[1]
end


#save the data
File.open("cal_train_times.json", "w") do |f|
  f.write(JSON.pretty_generate(trains_hash))
end

File.open("cal_train_stops.json", "w") do |f|
  f.write(JSON.pretty_generate(stops_hash))
end