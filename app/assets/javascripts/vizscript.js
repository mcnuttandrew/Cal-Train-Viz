(function() {
	var getData = function(ctx){
		$.ajax({
			url: "api/trains",
			type: "GET",
			async: false,
			success: function(trains){
				that.trains = trains
				$.ajax({
					url: "api/stops",
					type: "GET",
					async: false,
					success: function(stops){
						that.stops = stops
						buildGraphic(ctx, that.stops, that.trains);
					}
				})
			}
		})
		

	}
	
	var tableHeight = 400;
	var fullHeight = 700;
	var tableWidth = 800;
	var fullWidth = 1159;

	
	
	var buildGraphic = function(ctx, stops, trains){
		var w = tableWidth;
		var h = tableHeight;
		var svg = d3.select(".d3canvas")
								.append("svg")
								.attr({"width": fullWidth, "height": fullHeight})
								.append("g");
		buildGrid(svg, h, w, stops);
		$.ajax({
			url: "api/trains/1",
			type: "GET",
			success: function(train){
				buildExpandedRoute(h, w, svg, stops, train)
			}
		})
		buildTrainRoutes(svg, h, w, trains, stops);		
		buildSidebar(svg, h, w);			
	}
	
	var buildSidebar = function(svg, h, w){
		svg.append("rect")
				.attr("y", 3).attr("x", tableWidth + 10)
				.attr('width', fullWidth - w -15).attr('height', fullHeight-3)
				.attr('stroke', 'black').attr('fill', 'white');
		
		var trainTypes = [["blue", "baby bullet"], ["red", "limited stop"], ["gray", "local"]]
		svg.append("text")
				.attr("y", 70).attr("x", tableWidth + 30)
				.attr("font-size", 50)
				.attr("fill", "black").attr("stroke", "black")
				.text("CALTRAN:")
		svg.append("text")
				.attr("y", 120).attr("x", tableWidth + 30)
				.attr("font-size", 50)
				.attr("fill", "black").attr("stroke", "black")
				.text("WEEKDAYS")		
				
				
		for(var i = 0; i < trainTypes.length; i++){
			svg.append("rect")
					.attr("y", 150 + 50 * i).attr("x", tableWidth + 30)
					.attr('width', 300).attr('height', 30)
					.attr('fill', trainTypes[i][0]);
			svg.append("text")
					.attr("y", 170 + 50 * i).attr("x", tableWidth + 30)
					.attr("font-size", 38)
					.attr("fill", "white").attr("stroke", "white")
					.text(trainTypes[i][1])
		}				
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
					var _that = this;
					this.train =  train
					this.trainPath = [];
					for(var i = 0; i < train.time_stops.length; i++){
						if(train.time_stops[i].time){
							var time = train.time_stops[i].time.slice(11, 16).split(":");
							var timeCoord = (parseInt(time[0]) )  * 6 
							if(timeCoord/6 < 4){
								timeCoord += 12 * 6;
							}
							timeCoord -= 4 * 6;
							timeCoord += parseFloat(time[1])/10;
							if(timeCoord < 110){
								this.trainPath.push({
												"x": timeCoord * w / (21 * 6) + xoffset,
												"y": train.time_stops[i].stop_id * h/stops.length + yoffset
											});
							}
						}
					}
					
					//train coloring and drawing
					if(this.trainPath.length > 1){
						var color = "black";
						if(train.train_type === 2){
							color = "red"
						} else if (train.train_type === 3) {
							color = "blue"
						}
						
						svg.append("path")
							.attr("d", lineFunction(this.trainPath))
							.attr("stroke", color)
							.attr("stroke-width", 1)
							.attr("fill", "none")
							.on('click', function(d){ buildExpandedRoute(h, w, svg, stops, _that.train)})
							.on('mouseenter', function(d){ this.setAttribute('stroke-width', 2)})
							.on('mouseleave', function(d){ this.setAttribute('stroke-width', 1)});
							
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
															
		svg.append("rect")
				.attr("y", 3).attr("x", 0)
				.attr('width', tableWidth).attr('height', h * 1.05)
				.attr('stroke', 'black').attr('fill', 'white');
		
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
			
		// //horitzontal lines
		for(var i = 0; i <= stops.length; i++){
			
			var widthLine = [
					{"x": xoffset, "y": h / stops.length * i + yoffset}, 
					{"x": w, "y": h / stops.length * i + yoffset}
				];
				// debugger;
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
			var thick = '.5'
			if(i % 6 === 0){
				color = "black"
				thick = 1;
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
					 .attr({"x": xoffset - 5 + i * (w-xoffset)/ (21 * 6), "y": 15})
					 .attr("fill", "gray")
					 .attr("stroke", "gray")
					 .style("font-size", 15)
					 .text(content);
					 
			}
			svg.append("path")
				.attr("d", lineFunction(heightLine))
				.attr("stroke", color)
				.attr("stroke-width", thick)
				.attr("fill", "none");
		}
	}
	
	var buildExpandedRoute = function(h, w, svg, stops, train){
		var _y = tableHeight * 1.1;
		var xScale = d3.scale.linear().domain([0, w]).range([0, w]);
		var yScale = d3.scale.linear().domain([h, 0]).range([h, 0]);
		var lineFunction = d3.svg.line()
		                          .x(function(d) { return xScale(d.x); })
		                          .y(function(d) { return yScale(d.y); })
		                          .interpolate("linear");

		svg.append("rect")
				.attr("y", _y).attr("x", 0)
				.attr('width', tableWidth).attr('height', fullHeight - _y)
				.attr('stroke', 'black').attr('fill', 'white');
		var trainName;	
		if(train.train_type === 1){
			trainName = "local";
		} else if (train.train_type === 2){
			trainName = "limited stop";
		} else {
			trainName = "baby bullet";
		}
		svg.append("text").attr("x", 5).attr("y", _y + 20)
				.attr("fill", "gray").attr("stroke", "gray")
				.style("font-size", 25).text(trainName + ' ' + train.direction)
				
		var trainLine = [ {"x": 30, "y": _y + 180}, {"x": 50, "y": _y + 150}, 
	{"x": 750, "y": _y + 150}, {"x": 770, "y": _y + 120}
			];		
		svg.append("path")
			.attr("d", lineFunction(trainLine))
			.attr("stroke", "black")
			.attr("stroke-width", 1)
			.attr("fill", "none");
		//iterate across stops
		var incrementAmount = (700)/train.time_stops.length;
		for(var i = 1; i < train.time_stops.length; i++){
					var trainLine = [ {"x": 50 + i * incrementAmount, "y": _y + 155}, 
				{"x": 50 + i * incrementAmount, "y": _y + 145}];		
					svg.append("path")
						.attr("d", lineFunction(trainLine))
						.attr("stroke", "black")
						.attr("stroke-width", 1)
						.attr("fill", "none");
					
					if(train.time_stops[i].time){
						var xTransTime = 28 + i * incrementAmount;
						var yTransTime =  _y + 200;
						var content = train.time_stops[i].time.split("T")[1].split(":");					
						var hour = content[0];
						var minute  = content[1];
						if(hour < 12){
							minute = minute + "a";
						} else {
							hour = hour - 12;
							minute = minute + "p";
						}
						svg.append("text")
							 .attr('transform', 'translate(' + xTransTime + ',' + yTransTime + '),rotate(-60)')
							 .attr("fill", "gray")
							 .attr("stroke", "gray")
							 .style("font-size", 15)
							 .text(hour+":"+minute)
						
					}
					var xTransStop = 60 + (i) * incrementAmount ;
					var yTransStop =  _y + 145;	
					svg.append("text")
						 .attr('transform', 'translate(' + xTransStop + ',' + yTransStop + '),rotate(-60)')
						 .attr("fill", "gray")
						 .attr("stroke", "gray")
						 .style("font-size", 15)
						 .text(stops[train.time_stops[i].stop_id].name)	
					
					
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
