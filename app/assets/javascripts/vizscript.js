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
		var w = 2000;
		var h = 1000;
		var margins = {"left": 100, "right": 30, "top": 30, "bottom": 50};	
		// debugger;																
		var svg = d3.select(".d3canvas")
								.append("svg")
								.attr({"width": w, "height": h})
								.append("g");
								// .attr("transform", 'translate('+ w/2+ ','+ h/2 + ')');
		buildGrid(svg, h, w, stops);			
		
		// svg.append('circle').attr({'class': 'a', r: 200})
		// 						.style("fill", "black")
		// 						.style("stroke", "black")
		

	
	}
	
	var buildGrid = function(svg, h, w, stops){
		console.log(stops);
		
		
		svg.selectAll("text").data(stops).enter().append("text")
			 .text(function(d){return d.name})
			 .attr("x", 0)
			 .attr("y", function(d){return d.id *  h/stops.length-0.2 * h/stops.length})
       .attr("fill", "gray")
			 .attr("stroke", "gray");
			 
		
		var lineFunction = d3.svg.line()
		                          .x(function(d) { return d.x; })
		                          .y(function(d) { return d.y; })
		                          .interpolate("linear");
															
															
		var xoffset = 100;
		var yoffset = 20;
		for(var i = 0; i <= stops.length; i++){
			var widthLine = [
					{"x": xoffset, "y": h/stops.length * i + yoffset}, 
					{"x": w, "y": h/stops.length * i+ yoffset}
				];
			svg.append("path")
				.attr("d", lineFunction(widthLine))
				.attr("stroke", "black")
				.attr("stroke-width", 2)
				.attr("fill", "none");
		}
		
		for(var i = 0; i <= 146; i++){
			var heightLine = [
					{"x": xoffset + i * (w-xoffset)/ 144, "y": yoffset}, 
					{"x": xoffset + i * (w-xoffset)/ 144, "y": h}
				];
			var color = "gray";
			if(i % 6 === 0){
				color = "black"
				svg.append("text")
					 .attr({"x": xoffset + i * (w-xoffset)/ 144, "y": 15})
	         .attr("fill", "gray")
					 .attr("stroke", "gray")
					 .text((i / 6 + 6) % 12);
					 
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
		
		if(ctx){
			getData(ctx);
		}
	}, 100)
	
})()

