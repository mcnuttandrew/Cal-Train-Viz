(function() {
	var getData = function(ctx){
		$.ajax({
			url: "api/trains",
			type: "GET",
			async: false,
			success: function(trains){
				that.trains = trains
			}
		})
		$.ajax({
			url: "api/stops",
			type: "GET",
			async: false,
			success: function(stops){
				that.stops = stops
			}
		})
		buildGraphic(ctx, this.stops, this.trains);
	}
	
	var buildGraphic = function(ctx, stops, trains){
		var w = 800;
		var h = 400;
		var svg = d3.select(".d3canvas")
								.append("svg")
								.attr({"width": w, "height": h})
								.append("g");
		buildGrid(svg, h, w, stops);			
		buildTrainRoutes(svg, h, w, trains, stops);	

	
	}
	
	var buildTrainRoutes = function(svg, h, w, trains, stops){
		var xScale = d3.scale.linear().domain([0, w]).range([0, w]);
		var yScale = d3.scale.linear().domain([h, 0]).range([h, 0]);
		
		var lineFunction = d3.svg.line()
		                          .x(function(d) { return xScale(d.x); })
		                          .y(function(d) { return yScale(d.y); })
		                          .interpolate("linear");
															
		for(var i = 0; i < trains.length; i++){
			$.ajax({
				url: "api/trains/" + trains[i].id,
				type: "GET",
				success: function(train){
					var trainPath = [];
					for(var i = 0; i < train.time_stops.length; i++){
						if(train.time_stops[i].time){
							var time = train.time_stops[i].time.slice(11, 16).split(":");
							var timeCoord = (parseInt(time[0]) )  * 6 
							if(timeCoord/6 < 4){
								timeCoord += 12 * 6;
							}
							timeCoord -= 4 * 6;
							timeCoord += parseFloat(time[1])/10;
							trainPath.push({
											"x": timeCoord * w / (21 * 6) + xoffset,
											"y": train.time_stops[i].stop_id * h/stops.length + yoffset
										});
						}
					}
					//train coloring and drawing
					if(trainPath.length > 1){
						var color = "black";
						if(train.train_type === 2){
							color = "blue"
						} else if (train.train_type === 3) {
							color = "#7A0000"
						}
						
						svg.append("path")
							.attr("d", lineFunction(trainPath))
							.attr("stroke", color)
							.attr("stroke-width", 1)
							.attr("fill", "none");
					}
				}
			})

		}
	}
	
	var buildGrid = function(svg, h, w, stops){		
 		var xScale = d3.scale.linear().domain([0, w]).range([0, w]);
 		var yScale = d3.scale.linear().domain([h, 0]).range([h, 0]);
		var lineFunction = d3.svg.line()
		                          .x(function(d) { return xScale(d.x); })
		                          .y(function(d) { return yScale(d.y); })
		                          .interpolate("linear");
		
		//draw stop names
		svg.selectAll("text").data(stops).enter().append("text")
			 .text(function(d){return d.name})
			 .attr("x", xScale(10))
			 .attr("y", function(d){
				 return yScale(.99 * d.id *  h / stops.length) + 12.5
			 })
       .attr("fill", "gray")
			 .attr("stroke", "gray")
			 .style("font-size", 10);
			 

	 h/stops.length * i + yoffset

															
															
		var xoffset = 100;
		var yoffset = 20;
		
		//zones "data"
		var zone_ids = [[0, 5, "#eee"], 
										[5, 13, "#ccc"],
										[13, 20, "#aaa"],
										[20, 26, "#999"],
										[26, 28, "#777"],
										[28, 30, "#555"]];
		//draw zones								
		svg.selectAll("rect").data(zone_ids).enter().append("rect")
				.attr("x", xScale(that.xoffset))
				.attr("y", function(d){
					return yScale(d[0] * h / stops.length + that.xoffset / 5)
				})
				.attr("width", xScale(w - that.xoffset))
				.attr("height", function(d){
					return yScale((d[1] - d[0]) * h/stops.length)
				})
				.attr("fill", function(d){ return d[2]});
					
		//horitzontal lines
		for(var i = 0; i <= stops.length; i++){
			var widthLine = [
					{"x": xoffset, "y": h/stops.length * i + yoffset}, 
					{"x": w, "y": h/stops.length * i+ yoffset}
				];
			svg.append("path")
				.attr("d", lineFunction(widthLine))
				.attr("stroke", "black")
				.attr("stroke-width", 1)
				.attr("fill", "none");
		}
		//vertical lines
		for(var i = 0; i <= (21 * 6); i++){
			var heightLine = [
					{"x": xoffset + i * (w-xoffset)/ (21 * 6), "y": yoffset}, 
					{"x": xoffset + i * (w-xoffset)/ (21 * 6), "y": h * 1.1 - yoffset}
				];
			var color = "gray";
			if(i % 6 === 0){
				color = "black"
				content = (i / 6 + 4) % 12;
				///6 to convert to hour, + 4 for offset, %12 to convert to am/pm
				if((i/6) % 12 === 8){
					if((i/6) % 24 === 8 ){
						content = "n"
					} else {
						content = "m"
						
					}
				}
				//draw time
				svg.append("text")
					 .attr({"x": xoffset + i * (w-xoffset)/ (21 * 6), "y": 15})
					 .attr("fill", "gray")
					 .attr("stroke", "gray")
					 .style("font-size", 15)
					 .text(content);
					 
			}
			svg.append("path")
				.attr("d", lineFunction(heightLine))
				.attr("stroke", color)
				.attr("stroke-width", 1)
				.attr("fill", "none");
		}
	}
	///run the method
	var that = this;
	setTimeout(function(){
		var ctx = $.find(".d3canvas")
		that.xoffset = 100;
		that.yoffset = 20;
		if(ctx){
			getData(ctx);
		}
	}, 100)
	
})()

