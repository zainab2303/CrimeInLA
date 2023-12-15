let selectedHourSector; //  variable To select the desired hour

let currentPeriod = 'AM'; //Variable to select AM PM, default is set to AM

function updatePeriod(period) { //Function to update the variable according to AM and PM
    currentPeriod = period; // Setting currentPeriod as the selected variable AM or PM
}

//loading the data from github
d3.csv("https://raw.githubusercontent.com/zainab2303/CrimeInLA/main/Safety.csv").then(function (dataset) {
    const svg = d3.select("div#plot")
        .append("svg")
        .attr("width", 200) //svg element
        .attr("height", 400);

    const hourMarkers = Array.from({ length: 12 }, (_, i) => i + 1);

    svg.selectAll(".hour-marker")
        .data(hourMarkers)
        .enter().append("circle") //making a clock
        .attr("class", "hour-marker")
        .attr("cx", d => 100 + 80 * Math.cos((d * 30 - 90) * (Math.PI / 180)))
        .attr("cy", d => 100 + 80 * Math.sin((d * 30 - 90) * (Math.PI / 180)))
        .attr("r", 5)
        .on("click", handleHourMarkerClick);

    function handleHourMarkerClick(d) {
        d3.selectAll(".hour-marker").classed("selected-hour", false);
        d3.select(this).classed("selected-hour", true);

        if (selectedHourSector) {
            selectedHourSector.remove();
        }

        selectedHourSector = svg.append("path")
            .attr("class", "hour-sector")
            .attr("d", getSectorPath(30 * d - 15, 30 * d + 15))
            .attr("transform", "translate(100,100)");

        let selectedHour2 = d;

        //Checking the current period to display accordingly
        if (currentPeriod === "PM" && d !== 12) {
            selectedHour2 += 12;
        }

        displayDataForHour(selectedHour2);
    }

    // Making Sector for clarity :)
    function getSectorPath(startAngle, endAngle) {
        const radius = 90;
        const startRadians = (startAngle - 90) * (Math.PI / 180);
        const endRadians = (endAngle - 90) * (Math.PI / 180);

        const x1 = radius * Math.cos(startRadians);
        const y1 = radius * Math.sin(startRadians);

        const x2 = radius * Math.cos(endRadians);
        const y2 = radius * Math.sin(endRadians);

        return `M 0 0 L ${x1} ${y1} A ${radius} ${radius} 0 0 1 ${x2} ${y2} Z`;
    }

    //Making bar chart according to the hour selected
    function displayDataForHour(hour) {
        const selectedData = dataset.find(data => +data.time_bin === hour);

        d3.select("div#bar-chart").selectAll("svg").remove();

        const width = 500;
        const height = 300;
        const margin = { top: 90, right: 0, bottom: 50, left: 40 };
        const innerWidth = width - margin.left - margin.right;
        const innerHeight = height - margin.top - margin.bottom;

        const barChartSvg = d3.select("div#bar-chart")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        const xScale = d3.scaleBand()
            .domain(["F", "M"])
            .range([0, innerWidth])
            .paddingInner(0.1);

        const yScale = d3.scaleLinear()
            .domain([0, 1])
            .range([innerHeight, 0]);

        const xAxis = d3.axisBottom()
                      .scale(xScale);

        const yAxis = d3.axisLeft()
                      .scale(yScale).ticks(5).tickFormat(d3.format("0.3f"));

        //The Bars!
        barChartSvg.selectAll("rect")
            .data(["F", "M"])
            .enter().append("rect")
            .attr("class", d => (d === "F" ? "bar-f" : "bar-m"))
            .attr("x", d => xScale(d) + margin.left)
            .attr("y", d => yScale(+selectedData[d])+margin.top)
            .attr("width", xScale.bandwidth())
            .attr("height", d => innerHeight- yScale(+selectedData[d]));

        //text to display probablity
        barChartSvg.selectAll("text.bar-label")
            .data(["F", "M"])
            .enter().append("text")
            .attr("class", "bar-label")
            .attr("x", d => xScale(d) + xScale.bandwidth() / 2 + margin.left)
            .attr("y", d => yScale(+selectedData[d]) + margin.top - 5)
            .attr("text-anchor", "middle")
            .text(d => selectedData[d]);

        //xAxis
        barChartSvg.append("g")
            .attr("class", "xAxis")
            .attr("transform", `translate(${margin.left}, ${height - margin                                                                           .bottom})`)
            .call(xAxis);

        //yAxis
        barChartSvg.append("g")
            .attr("class", "yAxis")
            .attr("transform", `translate(${margin.left},${margin.top})`)
            .call(yAxis);
    }
});
