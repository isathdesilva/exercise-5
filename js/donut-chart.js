const drawDonutChart = data => {

  const width  = 500;
  const height = 500;
  const margin = 20;
  const radius = Math.min(width, height) / 2 - margin;

  const svg = d3.select("#donut-chart")
    .append("svg")
    .attr("viewBox", `0 0 ${width} ${height}`)
    .attr("width", "100%")
    .style("border", "1px solid black");

  const innerChart = svg.append("g")
    .attr("transform", `translate(${width / 2}, ${height / 2})`);

  // Colour scale — scaleOrdinal for discrete categories
  const colour = d3.scaleOrdinal()
    .domain(data.map(d => d.Screensize_Category))
    .range(d3.schemeSet2);

  // Calculate angles using d3.pie()
  const pie = d3.pie()
    .value(d => d.Count)
    .sort(null);

  // Arc generator — inner radius 60% makes it a donut
  const arcGenerator = d3.arc()
    .innerRadius(radius * 0.6)
    .outerRadius(radius);

  // Bind data and draw arcs
  innerChart.selectAll("path")
    .data(pie(data))
    .join("path")
      .attr("d", arcGenerator)
      .attr("fill", d => colour(d.data.Screensize_Category))
      .attr("stroke", "white")
      .attr("stroke-width", 2);

  // Labels using arcGenerator.centroid(d) to place text in slice centre
  innerChart.selectAll("text")
    .data(pie(data))
    .join("text")
      .attr("transform", d => `translate(${arcGenerator.centroid(d)})`)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .text(d => d.data.Screensize_Category);
};

// Data aggregated in KNIME: count of small/medium/large TVs
const donutData = [
  { Screensize_Category: "large",  Count: 1352 },
  { Screensize_Category: "medium", Count: 2386 },
  { Screensize_Category: "small",  Count: 770  }
];

console.log(donutData);
drawDonutChart(donutData);
