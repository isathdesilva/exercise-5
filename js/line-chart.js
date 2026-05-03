const drawLineChart = data => {

  const width  = 800;
  const height = 400;
  const margin = { top: 40, right: 80, bottom: 60, left: 70 };
  const innerWidth  = width  - margin.left - margin.right;
  const innerHeight = height - margin.top  - margin.bottom;

  const svg = d3.select("#line-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%");

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Both axes use scaleLinear — continuous data
  const xScale = d3.scaleLinear()
    .domain(d3.extent(data, d => d.year))
    .range([0, innerWidth]);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.averagePrice)])
    .nice()
    .range([innerHeight, 0]);

  // x axis — tickFormat("d") forces integer year labels
  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale).tickFormat(d3.format("d")).ticks(10));

  innerChart.append("g")
    .call(d3.axisLeft(yScale));

  innerChart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .text("Average Price ($ per MWh)");

  innerChart.append("text")
    .attr("x", innerWidth / 2)
    .attr("y", innerHeight + 45)
    .attr("text-anchor", "middle")
    .text("Year");

  // Area under line
  const area = d3.area()
    .x(d => xScale(d.year))
    .y0(innerHeight)
    .y1(d => yScale(d.averagePrice));

  innerChart.append("path")
    .datum(data)
    .attr("class", "area-path")
    .attr("d", area);

  // Line generator using d3.line()
  const lineGenerator = d3.line()
    .x(d => xScale(d.year))
    .y(d => yScale(d.averagePrice));

  // Append a path element using the line generator
  innerChart.append("path")
    .datum(data)
    .attr("class", "line-path")
    .attr("d", lineGenerator);

  // Scatter dots
  innerChart.selectAll("circle")
    .data(data)
    .join("circle")
      .attr("class", "dot")
      .attr("cx", d => xScale(d.year))
      .attr("cy", d => yScale(d.averagePrice))
      .attr("r", 4);

  // Line label
  const last = data[data.length - 1];
  innerChart.append("text")
    .attr("x", xScale(last.year) + 5)
    .attr("y", yScale(last.averagePrice))
    .attr("alignment-baseline", "middle")
    .style("font-size", "11px")
    .style("fill", "#2e7d32")
    .text("Average Price ($ per MWh)");
};

// Load ARE_Spot_Prices.csv with row conversion
d3.csv("data/ARE_Spot_Prices.csv", d => {
  return {
    year:         +d.Year,
    averagePrice: +d["Average Price (notTas-Snowy)"]
  };
}).then(data => {
  console.log(data);
  drawLineChart(data);
});
