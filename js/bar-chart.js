const drawBarChart = data => {

  const width  = 600;
  const height = 500;
  const margin = { top: 40, right: 30, bottom: 60, left: 70 };
  const innerWidth  = width  - margin.left - margin.right;
  const innerHeight = height - margin.top  - margin.bottom;

  const svg = d3.select("#bar-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%");

  const innerChart = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

  const xScale = d3.scaleBand()
    .domain(data.map(d => d.screenTech))
    .range([0, innerWidth])
    .padding(0.35);

  const yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.avgEnergy)])
    .nice()
    .range([innerHeight, 0]);

  innerChart.append("g")
    .attr("transform", `translate(0, ${innerHeight})`)
    .call(d3.axisBottom(xScale));

  innerChart.append("g")
    .call(d3.axisLeft(yScale));

  innerChart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -innerHeight / 2)
    .attr("y", -55)
    .attr("text-anchor", "middle")
    .text("Energy Consumption (kWh)");

  innerChart.selectAll("rect")
    .data(data)
    .join("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(d.screenTech))
      .attr("y", d => yScale(d.avgEnergy))
      .attr("width",  xScale.bandwidth())
      .attr("height", d => innerHeight - yScale(d.avgEnergy));

  innerChart.selectAll(".val")
    .data(data)
    .join("text")
      .attr("x", d => xScale(d.screenTech) + xScale.bandwidth() / 2)
      .attr("y", d => yScale(d.avgEnergy) - 6)
      .attr("text-anchor", "middle")
      .style("font-size", "12px")
      .text(d => d.avgEnergy + " kWh");
};

const barData = [
  { screenTech: "LED",  avgEnergy: 369 },
  { screenTech: "OLED", avgEnergy: 362 },
  { screenTech: "LCD",  avgEnergy: 335 }
];

console.log(barData);
drawBarChart(barData);
