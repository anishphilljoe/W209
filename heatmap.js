var margin = { top: 50, right: 0, bottom: 100, left: 30 },
          width = 960 - margin.left - margin.right,
          height = 430 - margin.top - margin.bottom,
          gridSize = Math.floor(width / 24),
          legendElementWidth = gridSize*2,
          buckets = 9,
          colors = ["#ffffe5","#ffffe5","#f7fcb9","#f7fcb9","#d9f0a3","#addd8e","#78c679" ,"#238443", "#004529","#00130b"], // alternatively colorbrewer.YlGnBu[9]
          days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"],
          times = ["1a", "2a", "3a", "4a", "5a", "6a", "7a", "8a", "9a", "10a", "11a", "12a", "1p", "2p", "3p", "4p", "5p", "6p", "7p", "8p", "9p", "10p", "11p", "12p"];
          datasets = ["s.csv", "r.csv"];
var datasetlabels = ["Sent","Received"];

      var svg1 = d3.select("#chart").append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      var dayLabels = svg1.selectAll(".dayLabel")
          .data(days)
          .enter().append("text")
            .text(function (d) { return d; })
            .attr("x", 0)
            .attr("y", function (d, i) { return i * gridSize; })
            .style("text-anchor", "end")
            .attr("transform", "translate(-6," + gridSize / 1.5 + ")")
            .attr("class", function (d, i) { return ((i >= 0 && i <= 4) ? "dayLabel mono axis axis-workweek" : "dayLabel mono axis"); });

      var timeLabels = svg1.selectAll(".timeLabel")
          .data(times)
          .enter().append("text")
            .text(function(d) { return d; })
            .attr("x", function(d, i) { return i * gridSize; })
            .attr("y", 0)
            .style("text-anchor", "middle")
            .attr("transform", "translate(" + gridSize / 2 + ", -6)")
            .attr("class", function(d, i) { return ((i >= 7 && i <= 16) ? "timeLabel mono axis axis-worktime" : "timeLabel mono axis"); });

      var heatmapChart = function(tsvFile) {
        d3.csv(tsvFile,
        function(d) {
            d.day= +d.day,
            d.hour= +d.hour,
            d.value= +d.value
			return d;
        },
        function(error, data) {
		console.log(data);
          var colorScale = d3.scaleQuantile()
              .domain([0, buckets - 1, d3.max(data, function (d) {return d.value; })])
              .range(colors);

          var cards = svg1.selectAll(".hour")
              .data(data, function(d) {return d.day+':'+d.hour;});

          cards.append("title");

          cards.enter().append("rect")
              .attr("x", function(d) { return (d.hour - 1) * gridSize; })
              .attr("y", function(d) { return (d.day - 1) * gridSize; })
              .attr("rx", 4)
              .attr("ry", 4)
              .attr("class", "hour bordered")
              .attr("width", gridSize)
              .attr("height", gridSize)
              //.style("fill", colors[0]);
			  .style("fill",function(d) { return colorScale(d.value);})
			  .append("svg:title");

          cards.transition().duration(1000)
              .style("fill", function(d) { return colorScale(d.value); });

          //cards.select("title").text(function(d) { return d.value; });

          cards.exit().remove();
//Legend start here
		var legend = svg1.selectAll(".legend")
              .data([1].concat(colorScale.quantiles()), function(d) { return d; });

          legend.enter().append("g")
              .attr("class", "legend");

          legend.append("rect")
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", height+100)
            .attr("width", legendElementWidth)
            .attr("height", gridSize / 2)
            .style("fill", function(d, i) { return colors[i]; });

          legend.append("text")
            .attr("class", "mono")
            .text(function(d) { return "≥ " + Math.round(d); })
            .attr("x", function(d, i) { return legendElementWidth * i; })
            .attr("y", 100+height + gridSize);

          legend.exit().remove();
//Legend end here


        });
      };

      heatmapChart("s.csv");

      var datasetpicker = d3.select("#dataset-picker").selectAll(".dataset-button")
        .data(datasets);

      datasetpicker.enter()
        .append("input")
        .attr("value", function(d,i){ return "Email Type: " + datasetlabels[i] })
        .attr("type", "button")
        .attr("class", "dataset-button")
        .on("click", function(d) {console.log(d3.select(this));d3.select(this).attr("fill","blue");
          heatmapChart(d);
        });
		
	
