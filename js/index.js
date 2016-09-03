let jsonUrl = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json";

let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

let normalColor = "DarkRed";
let highlightColor = "Crimson";

let margin = {
  top: 20,
  right: 90,
  bottom: 80,
  left: 20
};
let width = 960 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

// x axis scale
let x = d3.time.scale()
  .range([0, width]);

// y axis scale
let y = d3.scale.linear()
  .range([height, 0]);

let xAxis = d3.svg.axis()
  .scale(x)
  .orient("bottom")
  .ticks(15)
  .tickSize(10, 0);

let yAxis = d3.svg.axis()
  .scale(y)
  .orient("right")
  .tickSize(10, 0);

let chart = d3.select(".chart")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Get json data
d3.json(jsonUrl, function(error, json) {
  let data = json.data;

  let firstDate = new Date(data[0][0]);
  let lastDate = new Date(data[data.length - 1][0])

  x.domain([firstDate, lastDate]);
  y.domain([0, d3.max(data, function(d) {
    return d[1];
  })]);

  let barWidth = Math.ceil(width / data.length);

  // Div for tooltip box
  let tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("opacity", 0);

  // x axis
  chart.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis)
    .append("text")
    .attr("x", width / 2)
    .attr("y", 45)
    .style("text-anchor", "end")
    .text("Year");

  // y axis
  chart.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + (width + 4) + ", 0)")
    .call(yAxis)
    .append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (-1 * height / 2))
    .attr("y", 75)
    .style("text-anchor", "end")
    .text("GDP");

  // draw bars
  chart.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", function(d) {
      return x(new Date(d[0]));
    })
    .attr("y", function(d) {
      return y(d[1]);
    })
    .attr("height", function(d) {
      return height - y(d[1]);
    })
    .attr("width", barWidth)
    .attr("fill", normalColor)
    .on("mouseover", function(d) {
      // Tooltip
      let fullDate = d[0];
      let monthIndex = fullDate.substring(5, 7);
      let month = months[monthIndex - 1];
      let year = fullDate.substring(0, 4);

      let date = month + ", " + year;
      let gdp = "$" + d[1] + " Billion";

      tooltip.transition()
        .duration(200)
        .style("opacity", 0.9);
      tooltip.html(gdp + "<br/>" + date)
        .style("left", (d3.event.pageX + 10) + "px")
        .style("top", (d3.event.pageY - 55) + "px");
      // Bar color change
      d3.select(this)
        .attr("fill", highlightColor);
    })
    .on("mouseout", function(d) {
      tooltip.transition()
        .duration(500)
        .style("opacity", 0);
      d3.select(this)
        .attr("fill", normalColor);
    });

  // Title
  d3.select(".title")
    .append("text")
    .style("text-anchor", "end")
    .text("Gross Domestic Product");

  // Description below bar chart
  d3.select(".descrip")
    .append("text")
    .style("text-anchor", "end")
    .text(json.description);

});