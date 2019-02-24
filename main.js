// set the dimensions and margins of the graph
var margin = {top: 10, right: 225, bottom: 60, left: 50},
    width = 1360 - margin.left - margin.right,
    height = 270 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%d-%b-%y"),
    bisectDate = d3.bisector(function(d) { return d.date; }).left;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the 1st line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.Sent); });

// define the 2nd line
var valueline2 = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.Rec); });

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select("#trend").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
svg.append("rect").attr("x",width-300).attr("y",margin.top-20).attr("width",40).attr("height",10).attr("fill","red");
svg.append("text").text("Received").attr("x",width-250).attr("y",margin.top-10);
svg.append("rect").attr("x",width-300).attr("y",margin.top+5).attr("width",40).attr("height",10).attr("fill","blue");
svg.append("text").text("Sent").attr("x",width-250).attr("y",margin.top+15);
// Get the data
//var parseDate = d3.time.format("%Y-%m-%d").parse;


d3.csv("mailStat.csv", function(error, data) {
  if (error) {console.log("here")};

  // format the data
  data.forEach(function(d) {
      d.date1 = d.date;
      d.date = parseTime(d.date);
      //d.date = parseDate(d.date);
      d.Sent = +d.Sent;
      d.Rec = +d.Rec;
      //console.log(d.Rec);
      return d;
  });



  // Scale the range of the data
  x.domain(d3.extent(data, function(d) { return d.date; }));
  y.domain([0, d3.max(data, function(d) {
	  return Math.max(d.Sent, d.Rec); })]);

  // Add the valueline path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .attr("d", valueline);

  // Add the valueline2 path.
  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke", "red")
      .attr("d", valueline2);


  // Add the X Axis
  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(data.length));
  svg.selectAll(".tick text").attr("transform","rotate(-45)");

  svg.append("text")
        .attr("transform",
              "translate(" + (width/2) + " ," +
                             (height + margin.top + 40) + ")")
        .style("text-anchor", "middle")
        .text("Week Starting Date");

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y));
  svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - margin.left)
          .attr("x",0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .text("Count of Emails (Sent/ Received)");



//here Start
var focus = svg.append("g")
      .attr("class", "focus")
      .style("display", "none");

  focus.append("line")
      .attr("r", 4.5);

  focus.append("text")
      .attr("x", 9)
      .attr("dy", ".35em");

  svg.append("rect")
      .attr("class", "overlay")
      .attr("width", width)
      .attr("height", height)
      .on("mouseover", function() { focus.style("display", null); })
      .on("mouseout", function() { focus.style("display", "none"); })
      .on("mousemove", mousemove);


  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
        i = bisectDate(data, x0, 1),
        d0 = data[i - 1],
        d1 = data[i],
        d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.Sent) + ")");
    focus.select("text").text(d.date1).append("tspan").text(", Sent:").attr("fill","blue").append("tspan").text(d.Sent)
    .append("tspan").attr("fill","red").text(" Rec: ").append("tspan").text(d.Rec);
  }

//here end



});
