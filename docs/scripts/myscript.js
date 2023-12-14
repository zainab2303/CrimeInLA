// add your JavaScript/D3 to this file

       let currentPeriod = 'AM';
       function updatePeriod(period) {
          currentPeriod = period;

        }

    d3.csv("https://raw.githubusercontent.com/zainab2303/CrimeInLA/data/Safety.csv").then(function(dataset) {
         // Store the data in the global variable
        const svg = d3.select("div#id")
                    .append("svg")
                    .attr("width", 400)
                    .attr("height", 600)

        const clock = d3.select("div#clock")
            .append("svg")
            .attr("width",200)
            .attr("height", 300);

        const barChartSvg = d3.select("div#bar-chart")
            .append("svg")
            .attr("width", 400)
            .attr("height", 800);

        const hourMarkers = Array.from({ length: 12 }, (_, i) => i + 1);

        svg.selectAll("div#hour-marker")
            .data(hourMarkers)
            .enter().append("circle")
            .attr("class", "hour-marker")
            .attr("cx", d => 100 + 80 * Math.cos((d * 30 - 90) * (Math.PI / 180)))
            .attr("cy", d => 100 + 80 * Math.sin((d * 30 - 90) * (Math.PI / 180)))
            .attr("r", 5)
            .on("click", handleHourMarkerClick);

        function handleHourMarkerClick(d) {

            d3.selectAll("div#hour-marker").classed("selected-hour", false);
            d3.select(this).classed("selected-hour", true);

            svg.selectAll("div#hour-sector").remove();
            svg.append("path")
                .attr("class", "hour-sector")
                .attr("d", getSectorPath(30 * d - 15, 30 * d + 15))
                .attr("transform", "translate(100,100)");


            let selectedHour2 = d;
            if (currentPeriod === "PM" && d !== 12) {
             selectedHour2 += 12;
            }

            displayDataForHour(selectedHour2);
        }

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

        function displayDataForHour(hour) {
            const selectedData = dataset.find(data => +data.time_bin === hour);

            d3.select("div#bar-chart").selectAll("svg").remove();

            const width=600;
            const height=300;
            const margin={top:90,right:30,bottom:10,left:0};

            const barChartSvg = d3.select("div#bar-chart")
                .append("svg")
                .attr("width", width)
                .attr("height", height);

            const xScale = d3.scaleBand()
                .domain(["F", "M"])
                .range([0, width-margin.left-margin.right])
                .paddingInner(0.2);

            const yScale = d3.scaleLinear()
                .domain([0, d3.max([+selectedData.F, +selectedData.M])])
                .range([height-margin.top-margin.bottom, 0]);

              barChartSvg.selectAll("rect")
                .data(["F","M"])
                .enter().append("rect")
                .attr("class",d=>d==="F"?"bar-f":"bar-m")
                .attr("x",d=>xScale(d))
                .attr("y",d=>yScale(+selectedData[d]))
                .attr("width",xScale.bandwidth())
                .attr("height",d=>height-margin.top-margin.bottom-yScale(+selectedData[d]));



            barChartSvg.selectAll("text.bar-label")
            .data(["F","M"])
            .enter().append("text")
            .attr("class","bar-label")
            .attr("x",d=>xScale(d)+xScale.bandwidth()/2 + margin.left)
            .attr("y",d=>yScale(+selectedData[d])+margin.top-5)
            .attr("text-anchor","middle")
            .text(d=>selectedData[d]);



            barChartSvg.append("g")
                .attr("class", "axis")
                .attr("transform", `translate(0, ${200})`)
                .call(d3.axisBottom(xScale));

            barChartSvg.append("g")
                .attr("class", "axis")
                .attr("transform",`transfor(${margin.left},${margin.top})`)
                .call(d3.axisLeft(yScale).ticks(5).tickFormat(d3.format(".if")));
        }


    });
