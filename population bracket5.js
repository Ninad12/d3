d3.csv("DATA/world population.csv", function (data) {
	
	data.forEach(function(p) {
      p.Population = +p.Population;
    });
    
    var cf = crossfilter(data);
    var byCountries = cf.dimension(function(p){return p.CountryEnglish;});
    var byContinents = cf.dimension(function(p){return p.ContinentName;});
    var byPopulation = cf.dimension(function(p){return p.Population;});
    var groupByContinents = byContinents.group();
    var groupByCountries = byCountries.group().reduceSum(function(d){return d.Population});
    var selContinents = Array();
	var selFilters = Array();
	var selContinentsKey = Array();
	var fullSequence = Array();

	for (i=0;i<data.length;i++){
			
			fullSequence.push(data[i]);
			
		}

	
	var selC5 = Array();
	var totalPopulationSum = Array();
	
	var selCountriesKey = Array();
	var selCountriesIndex = Array();
	var selCountriesValue = Array();
	var index = Array();
	var totalCountryCount = Array();

	
	var min_value_prev = 0;
	var max_value_prev = 2000000000;
	var min_value_filter = 0;
	var max_value_filter = 2000000000;
	
	var cx = Array();
	var cy = Array();
	var selectedCountries = Array();
	var selectFlag = Array();
	
	var inputSmall = Array();
	var inputMedium = Array();
	var inputLarge = Array();
	var inputMega = Array();
	
	var xPrevSmall = Array();
	var yPrevSmall = Array();
	var xPrevMedium = Array();
	var yPrevMedium = Array();
	var xPrevLarge = Array();
	var yPrevLarge = Array();
	var xPrevMega = Array();
	var yPrevMega = Array();
	
    byCountries.filterAll();
    byContinents.filterAll();
	byPopulation.filterAll();
	
	barchartContinents("#chart3", groupByContinents, byPopulation, selContinents, selContinentsKey);
	barchartCountries("#countries4", groupByCountries);
	
	
	
	function barchartContinents(id, groupByContinents, byPopulation, selContinents, selContinentsKey) {
		
		//axis for the chart        
		var xScale = d3.scale.linear()
		.domain([0,60])
		.range([160, 520])
			
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('top')
			.ticks(7)
			.tickPadding(3)
			
		var resetCanvas = d3.select(id)
			.append("svg")
			.attr("width", 140)
			.attr("height", 40)
			.style("border","1px white solid")
			.style("margin-right","10px")
			
		var gResetButton1 = resetCanvas.append('g')
			.attr("transform", "translate(" + 0 + "," + 0 + ")")
			.attr("id", "gResetButton1");
			
		var gResetButton2 = resetCanvas.append('g')
			.attr("transform", "translate(" + 0 + "," + 0 + ")")
			.attr("id", "gResetButton2");

		var gResetBins = resetCanvas.append('g')
			.attr("transform", "translate(" + 0 + "," + 0 + ")")
			.attr("id", "gResetBins");
			

		resetButtonDeco = gResetButton1.append("circle")
			.attr("fill","steelblue")
			.attr("cx", 120)
			.attr("cy", 20)
			.attr("r", 10)	
			.style("stroke-width","1px")
			
			
		var count = 1;
		while(count < 2){
		resetButton = gResetButton2.append("circle")
			.attr("fill",function (d,i) {if (selContinents[i] == undefined) {return "#CDDDED"} else {return "steelblue"};})
			.attr("cx", 120)
			.attr("cy", 20)
			.attr("r", 8)	
			.style("stroke-width","1px")
				.on("click",clickReset)
				.on("mouseenter",mouseenterReset)
				.on("mouseout",mouseoutReset);
		count++;
		}

			

		var xAxisGuide = d3.select(id)
			.append("svg")
			.attr("width", 446)
			.attr("height", 40)
			.style("border","1px white solid")
			.append('g')
			.attr("transform", "translate(" + 0 + "," + 0 + ")");
    
			
		xAxis(xAxisGuide)
		xAxisGuide.attr('transform','translate(-150,30)')
		xAxisGuide.selectAll('path')
			.style('fill','none')
			.style('stroke','#000')
		xAxisGuide.selectAll('line')
			.style('stroke','#000')
			
		var chart = d3.select("#chart3")
			.append("svg")
		    .attr("width", 600)
		    .attr("height", 200)
			.style("border","1px white solid")
			
		var PopBar = d3.select(id)
			.append("svg")
			.attr("width", 600)
			.attr("height", 55)
			.style('border','1px white solid')

		var Continents = groupByContinents.all();
		
		var x = d3.scale.linear()
			.domain([0, 60])
			.range([0, 360]);
 
			
		var gChart = chart.append("g")
			.attr("transform", "translate(" + 160 + "," + 0 + ")")
			.attr("id","gChart");	

					
		var gChartLables = chart.append("g")
			.attr("transform", "translate(" + 160 + "," + 0 + ")")
			.attr("id","gChartLables");
			
		var gPopBar = PopBar.append('g')
			.attr('transform','translate(150,0)')
			.attr("id","gPopBar");
			
			
		var continentLabels = gChartLables.selectAll(".party-label")
            .data(Continents)
			.enter()
				.append("text")
				.attr("fill","black")
				.attr("x", -10)
				.attr("y", function (d,i) {return ((i * 25) + 15);})
				.attr("text-anchor", "end")
				.text(function(v) { return v.key; });
			
		var tooltipContinents = d3.select('#chart3')
			.append('tooltipsContinents')
			.style('position','absolute')
			.style('background','#f4f4f4')
			.style('padding-left','5px')
			.style('padding-right','5px')
			.style('border','1px #333 solid')
			.style('border-radius','5px')
			.style('opacity','0')
			.style('color','black') 
				
				
		var tooltipReset = d3.select(id)
			.append('tooltipsReset')
			.style('position','absolute')
			.style('background','#f4f4f4')
			.style('padding-left','5px')
			.style('padding-right','5px')
			.style('border','1px #333 solid')
			.style('border-radius','5px')
			.style('opacity','0')
			.style('color','black')	

		barfiltersByPopulation("#filters3");
		populationRange("#slider3",0,2000000000);
		continentList(groupByContinents, byPopulation, selContinents, selContinentsKey);
		clearStrip(selContinents, selFilters);
		
		
	function clickReset(d,i){
		
		if (selContinentsKey.length != 0 || selFilters.length != 0 || selFilters[-1] != undefined){
			selContinents.splice(0,selContinents.length);
			selContinentsKey.splice(0,selContinentsKey.length);
			selFilters.splice(0,selFilters.length);
			selFilters[-1] = undefined;
			
			
		d3.select(this)
		.style("fill", "#CDDDED")
		.style("opacity", "1");

		byPopulation.filterRange([0,2000000000]);
	
		d3.select("#gPopBar").selectAll('rect').remove()
		d3.select("#gPopBar").selectAll('text').remove()
		barfiltersByPopulation("#filters3");
				
		d3.select("#slider3").selectAll('svg').remove();
		populationRange("#slider3",0,2000000000);

		continentList(groupByContinents, byPopulation, selContinents, selContinentsKey);
		clearStrip(selContinents, selFilters);
		
		min_value_prev = 0;
		max_value_prev = 2000000000;
		min_value_filter = 0;
		max_value_filter = 2000000000;

		byCountries.filterAll();
		byContinents.filterAll();
		byPopulation.filterAll();
		
		d3.select("#countries4").selectAll('svg').remove();
		barchartCountries("#countries4", groupByCountries);
		
		}
		
	}

	function mouseenterReset(d,i){
		
		if (selContinentsKey.length != 0 || selFilters.length != 0 || selFilters[-1] != undefined){
			
		d3.select(this)
			.style("fill", "brown")
			.style("opacity", "1")
			
		tooltipReset.transition()
			.duration(100)
			.style("opacity","1");
			
		tooltipReset.html("reset selections")
			.style('left',((d3.event.pageX+10)+'px'))
			.style('top', (d3.event.pageY+10+'px'));
			}
		
		
	}

	function mouseoutReset(d,i){
		
		if(selContinentsKey.length === 0 & selFilters.length === 0 & selFilters[-1] == undefined){
			d3.select(this)
			.style("fill", "#CDDDED")
			.style("opacity", "1")
			}
			else {
			d3.select(this)
			.style("fill", "steelblue")
			.style("opacity", "1")
			}
			
			tooltipReset.transition()
			.duration(0)
			.style("opacity","0");
			
			tooltipReset.html("");
		
	}	
	
	function clearStrip(selContinents, selFilters){
			
		var mockdata = Array ();
		
		for (i=1;i<=15;i++){
			mockdata.push(i);
		}
		
		var clearStripArray = Array();
		
		for (i=0;i<=selContinents.length;i++){
			if (selContinents[i] != undefined){
			clearStripArray.push("true")
			};
		}
		
		for (i=0;i<=selFilters.length;i++){
			if (selFilters[i] != undefined){
			clearStripArray.push("true")
			};
		}
		
		if (selFilters[-1] != undefined){
			clearStripArray.push("true")
			};
		
				
		
		
		var bin = gResetBins.selectAll(".bins")
					.data(mockdata)
					.enter()
					.append("rect")
					.attr("fill", function (d,i) { if(!clearStripArray[i]){return "#CDDDED"} else {return "steelblue"}})
					.attr("x", function(d,i) { return (i * 6) + 10; })
					.attr("y", 10)
					.attr("width", 4)	
					.attr("height", 20);
					
		
	}
	
	function barfiltersByPopulation(id){
	
	var PopulationBarData = [	
			{"size":"Small","min":1,"max":100000},
			{"size":"Medium","min":100000,"max":1000000},
			{"size":"Large","min":1000000,"max":10000000},
			{"size":"Mega","min":10000000,"max":2000000000}
			];
	

		PopulationBarData.forEach(function(p) {
		  p.min = +p.min;
		  p.max = +p.max;
		});
		
		
		var Labels = gPopBar.selectAll(".label")
            .data(PopulationBarData);
    
        Labels = Labels.enter().append("text")
            .attr("x", function(d, i) { return i * 100})
            .attr("y", 45)
            .attr("dx", 0)
            .attr("dy", ".25em")
            .text(function(v) { return v.size; })
			;	
		
		var PopulationBars = gPopBar
					.selectAll(".PopulationBars")
					.data(PopulationBarData);
				
		PopulationBars
		.enter()
		.append("rect")	
			.attr("x", function(d, i) { return i * 90})
			.attr("y", 10)
			.attr("width", 80)
			.attr("height", 20)
			.style("fill", "#103E56")
			.style('opacity','0.65')
			.style('stroke','#000')
			.on("click", clickBar)
			.on("mouseenter", mouseenterBar)
			.on("mouseout", mouseoutBar)
			;
			
		var tooltipBars = d3.select(id).append('tooltipsBar')
				.style('position','absolute')
				.style('background','#f4f4f4')
				.style('padding-left','5px')
				.style('padding-right','5px')
				.style('border','1px #333 solid')
				.style('border-radius','5px')
				.style('opacity','0')
				.style('color','black')    
		
			repeatAgain();
			
		var svgPopulation = d3.select("#slider3");
		var svgCountries = d3.select("#countries4");
		var min = Array();
		var max = Array();
					
	function repeatAgain (){
		var count = 1;
		while(count < 3)
			{
			var DecoBars = gPopBar
				.selectAll(".DecoBars")
				.data(PopulationBarData);
			
			DecoBars.enter().append("rect")	
				.attr("x", function(d, i) {return i * 90 + count * 5})
				.attr("y", 10)
				.attr("width", 2)
				.attr("height", 20)
				.style("fill", "white");
			count++;
			}
		}
	
	function clickBar(d,i){
		if(selFilters.length === 0 & !selFilters[i])
			{selFilters[i] = PopulationBarData[i].size;
							
			d3.select(this)
				.style("fill","black")
				.style('opacity','1');
				
			selFilters[-1] = undefined;
			min[i] = PopulationBarData[i].min;
			max[i] = PopulationBarData[i].max;
			
			brushExtent("clicked",min[i],max[i]);
			
				if (!svgPopulation.empty()) {
						svgPopulation.selectAll('svg').remove()
					}
		
			populationRange("#slider3",min[i],max[i]);

			if (!svgCountries.empty()) {
				svgCountries.selectAll('svg').remove()
					}

			barchartCountries("#countries4", groupByCountries);
				}
				
	
			  
		  else {
			if(selFilters.length != 0 & !selFilters[i])
				{selFilters[i] = PopulationBarData[i].size
				 d3.select(this)
					.style("fill","#103E56")
					.style("opacity","0.2")
					.style('stroke','#000');
					selFilters[i] = undefined;
					selFilters.length = selFilters.length;
				}
			
			else {
				
		d3.select(this)
				.style("fill","#103E56")
				.style('opacity','0.65')
				.style('stroke','#000');

		brushExtent("filterAll",0,2000000000);
					
				if (!svgPopulation.empty()) {
						svgPopulation.selectAll('svg').remove()
					}
		
		populationRange("#slider3",0,2000000000);
				
				if (!svgCountries.empty()) {
						svgCountries.selectAll('svg').remove()
					}

				barchartCountries("#countries4", groupByCountries);
					
				selFilters[i] = undefined;
				selFilters[-1] = undefined;
				selFilters.length = 0;
			}
			}
			
		clearStrip(selContinents, selFilters);
				
		if (selContinentsKey.length === 0 & selFilters.length === 0 & selFilters[-1] == undefined){
						
				d3.select("#gResetButton2").selectAll("circle")
				.style("fill", "#CDDDED")
				.style("opacity", "1");
				}
				else{
				d3.select("#gResetButton2").selectAll("circle")
				.style("fill", "steelblue")
				.style("opacity", "1");
				}
	}

	function mouseenterBar(d,i){
		
		
			d3.select(this)
			.style("fill", "brown")
			.style("opacity", "1")
			
			tooltipBars.transition()
			.duration(0)
			.style("opacity","1")
			
			tooltipBars.html("between " + d3.format(",")(d.min) + " to " + d3.format(",")(d.max))
			.style('left',((d3.event.pageX+20)+'px'))
			.style('top', (d3.event.pageY+20+'px'))
		
		if (selFilters.length === 0) {
			min[i] = PopulationBarData[i].min;
			max[i] = PopulationBarData[i].max;

			d3.select("#gChart").selectAll('rect').remove();
			byPopulation.filterRange([min[i], max[i]]);
			continentList(groupByContinents, byPopulation, selContinents, selContinentsKey);

		}
		
		if (selFilters.length != 0 & !selFilters[i]){
				d3.select(this)
					.style("fill","#103E56")
					.style("opacity","0.65");

			tooltipBars.transition()
			.duration(0)
			.style("opacity","1")
			
			tooltipBars.html("filter not active")
			.style('left',((d3.event.pageX+20)+'px'))
			.style('top', (d3.event.pageY+20+'px'))					
		}
			
	}

	function mouseoutBar(d,i){
		
		
		tooltipBars.transition()
		.duration(0)
		.style("opacity","0")

		
		tooltipBars.html("");		
			
		if (!selFilters[i] & selFilters.length===0){
			d3.select(this)
				.style("fill","#103E56")
				.style("opacity","0.65");
				
			brushExtent("mouseout",0,0)
			}

		if (selFilters[i] == PopulationBarData[i].size) {
			d3.select(this)
			.style("fill","black")
			.style('stroke','#000')
			.style("opacity", "1");
			}
			
		if (!selFilters[i] & selFilters.length !=0){
			d3.select(this)
				.style("fill","#103E56")
				.style("opacity","0.65");
			}	
	}
	
	}

	function brushExtent(id, min_value, max_value) {
		
				var svgPopulation = d3.select("#slider3");
				var svgCountries = d3.select("#countries4");
								
				if  (min_value === 0 & max_value === 0){
					 min_value = min_value_prev;
					 max_value = max_value_prev;
					 }
					 else {

				if (min_value === max_value){
					 min_value = min_value_filter;
					 max_value = max_value_filter;
					 }
					 }
				
				byPopulation.filterRange([min_value, max_value]);
				d3.select("#gChart").selectAll('rect').remove();
				continentList(groupByContinents, byPopulation, selContinents, selContinentsKey);
			
					min_value_prev = min_value;
					max_value_prev = max_value;
				
				if (id == "clicked") {
					min_value_filter = min_value;
					max_value_filter = max_value;
					selC5 = this;
				}
				
				if (id == "filterAll") {
					min_value_filter = min_value;
					max_value_filter = max_value;
					selC5 = undefined;
				}				
	}

	function populationRange(id,min,max){

	var xAxisGuide = d3.select(id)
			.append("svg")
			.attr("width",600)
			.attr("height",70)
			.style('border','1px white solid')
			.style('background','white')
			.append("g")
			.attr('transform','translate(' + 50 + ',' + 60 + ')')
			.attr("id","gxAxisGuide");


	var minRange = 0
	var maxRange = (max * 0.2) + max;
	

	var xScale = d3.scale.linear()
		.domain([minRange,maxRange])
		.rangeRound([0,500]);
		
	var brush = d3.svg.brush()
			.x(xScale)
			.on("brush", brushed);

	var ticks = xScale.ticks(10);
	
	var xAxis = d3.svg.axis()
				.scale(xScale)
				.orient('top')
				.ticks(5)
				.tickSize(30)
				.tickPadding(10);	

	xAxis(xAxisGuide);
				
	
		xAxisGuide.selectAll('path')
			.style('fill','#103E56')
			.style('opacity','0.7')
			.style('stroke','white')
			.style('stroke-width','2.5px');	

		
		xAxisGuide.selectAll('line')
			.style('stroke','white')
			.style('stroke-width','2.5px');
			
		brush.extent([0,0]);
		brush(xAxisGuide);
		
		
		xAxisGuide.selectAll("rect")
			.attr("height",25)
			.attr("y","-30")
			.style("fill","black")
			.style("stroke","white")
			.style("opacity","0.7")
			.on("mouseenter",mouseenter)
			.on("mouseout",mouseout)

			
		var x = function (d,i){return xScale(d);};
		
			
		xAxisGuide.selectAll(".decobars")
			.data(ticks)
			.enter()
			.append("rect")
			.attr("x", x)
			.attr("y", -30)
			.attr("width", 2)
			.attr("height", 40)
			.style("fill", "white");		
			
		xAxisGuide.selectAll(".decobars1")
			.data(ticks)
			.enter()
			.append("rect")
			.attr("x", x)
			.attr("y", -10)
			.attr("width", 50)
			.attr("height", 1)
			.style("fill", "white");	
			
			
		xAxisGuide.selectAll(".decobars2")
			.data(ticks)
			.enter()
			.append("rect")
			.attr("x", x)
			.attr("y", -8)
			.attr("width", 50)
			.attr("height", 1)
			.style("fill", "white");	

		var tooltipPopulation = d3.select(id).append('tooltipsPopulation')
			.style('position','absolute')
			.style('background','#f4f4f4')
			.style('padding-left','5px')
			.style('padding-right','5px')
			.style('border','1px #333 solid')
			.style('border-radius','5px')
			.style('opacity','0')
			.style('color','black')	
			

	var svgPopulation = d3.select("#slider3");
	var svgContinents = d3.select("#chart3");
	
	var min_prev;
	var max_prev;
		

	function trigger() {
				newExtent = brush.extent();
				var min_value = newExtent[0];
				var max_value = newExtent[1];
				
				tooltipPopulation.transition()
				.style("opacity","1");
				
				
				if (min_value === 0 & max_value === 0)
					
					{
						tooltipPopulation.html("select range")
						.style('left',((d3.event.pageX+10)+'px'))
						.style('top', (d3.event.pageY+10+'px'));
					}
					else
					{
						tooltipPopulation.html("between " + d3.format(",")(min_value) + " to " + d3.format(",")(max_value))
						.style('left',((d3.event.pageX+20)+'px'))
						.style('top', (d3.event.pageY+20+'px'));
					}				
		};

	function brushed() {
	if (d3.event.sourceEvent.type === "brush") return;
					var extent = brush.extent()
					
					var tmp_min = 2000000000;
					var tmp_max = 2000000000;
					
					for (var i = ticks.length-1; i>=0; i--)
					{
						var rounded_min = Math.round(extent[0]);
						var rounded_max = Math.round(extent[1]);
						
						var diff_min = ticks[i] - rounded_min; 
						var diff_max = ticks[i] - rounded_max;
												
						if (Math.abs(diff_min) < tmp_min) 
							var min = ticks[i];
							tmp_min = Math.abs(diff_min);
							
						if (Math.abs(diff_max) < tmp_max) 
							var max = ticks[i];
							tmp_max = Math.abs(diff_max);
					}

					extent = ([min,max]);
					brush.extent([min,max]);
					brush(xAxisGuide);
					trigger();
					
				min_value_prev = min;
				max_value_prev = max;
				
					
				byPopulation.filterRange([min, max]);
				if (min === max){
				brushExtent("brushed", min, max);
				selFilters[i] = undefined;
				clearStrip(selContinents, selFilters);
				
				if (selContinentsKey.length === 0 & selFilters.length === 0 & selFilters[-1] == undefined){
						
				d3.select("#gResetButton2").selectAll("circle")
				.style("fill", "#CDDDED")
				.style("opacity", "1");
				
				min_value_prev = 0;
				max_value_prev = 2000000000;
				min_value_filter = 0;
				max_value_filter = 2000000000;

				byCountries.filterAll();
				byContinents.filterAll();
				byPopulation.filterAll();
				
				d3.select("#countries4").selectAll('svg').remove();
				barchartCountries("#countries4", groupByCountries);
				
				}
	
				} else {
				
				if (min != min_prev || max != max_prev){
					
				selFilters[i] = "Range";
				clearStrip(selContinents, selFilters);
				
				d3.select("#gResetButton2").selectAll("circle")
				.style("fill", "steelblue")
				.style("opacity", "1");
				
				d3.select("#gChart").selectAll('rect').remove();
				continentList(groupByContinents, byPopulation, selContinents, selContinentsKey);
				
				d3.select("#countries4").selectAll('svg').remove();
				barchartCountries("#countries4", groupByCountries);
				
				}
				
				}
				
				
				min_prev = min;
				max_prev = max;

		}
		
	function mouseenter(d){
					d3.select(this)
					.style("fill", "brown")
					.style("opacity", "1")
					trigger();					
					}

	function mouseout(d){
					d3.select(this)
					.style("fill", "black")
					.style("opacity", "0.8");
					

			
					tooltipPopulation.transition()
					.duration(0)
					.style("opacity","0");
					
					tooltipPopulation.html("");
					
					}					
					
}
			
	function continentList(groupByContinents, byPopulation, selContinents, selContinentsKey){
			
		
		gChart.selectAll(".Continents")
				.data(Continents)
				.enter()
				.append("rect")
				.attr("fill", function (d,i) { if(!selContinents[i]){return "steelblue"} else {return "black"}})
				.attr("y", function (d,i) {return i * 25;})
				.attr("width", function(v) { if(v.value != 0) {return x(v.value); }})
				.attr("height", 23)
				.on("mouseenter", mouseenterContinents)
				.on("mouseout", mouseoutContinents)
				.on("click",clickContinents);

			var svgCountries = d3.select("#countries4");
			var filter = Array();
			

			repeatAgain();
			
		function repeatAgain (){
				var count = 1;
				while(count < 12)
				{
				var DecoBars = gChart.selectAll(".DecoBars")
					.data(Continents);
					
				DecoBars.enter().append("rect")	
					.attr("x", count * 30)
					.attr("y", function (d,i) {return i * 25;})
					.attr("width", 2)
					.attr("height", 23)
					.style("fill", "white");
				count++;
				}
			}
			
		function clickContinents(d,i){
			
			   if  (!selContinents[i]){
					selContinents[i] = this;
					d3.select(this)
					.style("fill","black");

					filter[i] = Continents[i].key;
					
					selContinentsKey.push(filter[i]);
					
					byContinents.filter(function(d){
					  return selContinentsKey.indexOf(d) > -1;
					});
					
					
					if (!svgCountries.empty()) {
							svgCountries.selectAll('svg').remove()
						  }
					barchartCountries("#countries4", groupByCountries);
					
					}
					  
				  else {
					d3.select(selContinents[i])
					.style("fill","steelblue");
					
					filter[i] = Continents[i].key;
					
					var index = selContinentsKey.indexOf(filter[i]);
					
					if (index > -1) {
						selContinentsKey.splice(index, 1);
					}
					
					if(!selContinentsKey[0]){
						byContinents.filterAll();
						if (!svgCountries.empty()) {
							svgCountries.selectAll('svg').remove()
						  }
						barchartCountries("#countries4", groupByCountries);
					}
					
					else
						byContinents.filter(function(d){
							return selContinentsKey.indexOf(d) > -1;
						});
					
					
					if (!svgCountries.empty()) {
							svgCountries.selectAll('svg').remove()
						  }
					barchartCountries("#countries4", groupByCountries);
					
					selContinents[i] = undefined;
					};

					

					
					clearStrip(selContinents, selFilters);
					
					if (selContinentsKey.length === 0 && selFilters.length === 0){
						
						
					d3.select("#gResetButton2").selectAll("circle")
					.style("fill", "#CDDDED")
					.style("opacity", "1");
					}
					else{
					d3.select("#gResetButton2").selectAll("circle")
					.style("fill", "steelblue")
					.style("opacity", "1");
					}
		
				}

		function mouseenterContinents(d){
				d3.select(this)
				.style("fill", "brown")
				.style("opacity", "1")			
								
				tooltipContinents.transition()
				.style("opacity","1")
				.style('border','1px #333 solid')

				
				tooltipContinents.html(d.key + " has " + d.value + " countries")
				.style('left',((d3.event.pageX+100)+'px'))
				.style('top', (d3.event.pageY+'px'))
				
				}	

		function mouseoutContinents(d,i){

			tooltipContinents.transition()
				.style("opacity","0")
				
			//tooltipContinents.html("");
				
				
				{if(!selContinents[i])
			   {d3.select(this)
				.style("fill","steelblue");
				   }
				  
			  else 
			  {d3.select(this)
				.style("fill","black");
			}}
			
			}
		
		};
				
	}
	
	function barchartCountries(id, groupByCountries){
		
		var CountriesOverview = groupByCountries.top(Infinity);
		
			for (i=0;i<CountriesOverview.length;i++){
			if(CountriesOverview[i].value > 0){
				var maxCountriesOverview = i;
			}
		}
		
		
		var minRange = 0;
		var maxRange = 10;
		var minRangeOverview = 0;
		var maxRangeOverview = 30;

		var temp1 = Array();
			
		for (i=0;i<CountriesOverview.length;i++){
			
		temp1.push(CountriesOverview[i].value);
		}
		
		var totalPopulationCheck = d3.sum(temp1);
		
		if (totalPopulationCheck === 0){ 
			var svgCountriesPie = d3.select("#container2");
			if (!svgCountriesPie.empty()) {
				svgCountriesPie.selectAll('svg').remove()
					  }
			return;
		}

		

		
		var clearCountries = d3.select(id)
		.append("svg")
		.attr("width", 140)
		.attr("height", 40)
		.style("margin-right",9)
		.style('border','1px white solid')
		

		gR1 = clearCountries.append('g')
				.attr("id","gR1");
				
		gR2 = clearCountries.append('g')
				.attr("id","gR2");
				
		gBins = clearCountries.append('g')
				.attr("id","gBins");

		var xAxisGuide = d3.select(id)
		.append("svg")
		.attr("width", 300)
		.attr("height", 40)
		.style('border','1px white solid')
		.append('g')
		
		var CountriesPrev = d3.select(id)
		.append("svg")
		.attr("width", 90)
		.attr("height", 40)
		.style('border','1px white solid')
		.style("margin-left",9)
		.append('g')
		
		
		var canvasCountries = d3.select(id)
			.append("svg")
			.attr("width",450)
			.attr("height",300)
			.style('border','1px white solid')
			.style("margin-left","0px")
    
		var canvasOverview = d3.select(id)
			.append("svg")
			.attr("width",90)
			.attr("height",300)
			.style('border','1px white solid')
			.style("margin-left","10px")
			
			
		var CountriesResult = d3.select(id)
		.append("svg")
		.attr("width", 450)
		.attr("height", 40)
		.style('border','1px white solid')
		.style("margin-left",0)
		.append('g')
		
		
		var CountriesNext = d3.select(id)
		.append("svg")
		.attr("width", 90)
		.attr("height", 40)
		.style('border','1px white solid')
		.style("margin-left",9)
		.append('g')
		
		gPrev = CountriesPrev.append('g')
				.attr("transform", "translate("+35+","+5+")")
				.attr("id","gPrev")
				
		
		gNext = CountriesNext.append('g')
				.attr("transform", "translate("+35+","+(-5)+")")
				.attr("id","gNext")
				
 
		var lineFunction = d3.svg.line()
                          .x(function(d) { return d.x; })
                          .y(function(d) { return d.y; })
                          .interpolate("linear");
						  
		var lineDataPrev = [ { "x": 0,   "y": 40},
							 { "x": 20,  "y": 20},
							 { "x": 40,  "y": 40},
							 { "x": 0,   "y": 40}];

		
		
		prevThirty = gPrev.append("path")
					.attr("d", lineFunction(lineDataPrev))
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 2)
                    .attr("fill", fillPrevThirty)
						.on("click",clickPrevThirty)
						.on("mouseenter",mouseenterPrevThirty)
						.on("mouseout",mouseoutPrevThirty);
						
					
		var lineDataNext = [ { "x": 0,   "y": 0},
							 { "x": 20,  "y": 20},
							 { "x": 40,  "y": 0},
							 { "x": 0,   "y": 0}];

		
		nextThirty = gNext.append("path")
					.attr("d", lineFunction(lineDataNext))
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 2)
                    .attr("fill",fillNextThirty)
						.on("click",clickNextThirty)
						.on("mouseenter",mouseenterNextThirty)
						.on("mouseout",mouseoutNextThirty);
						

			
			
		resetButtonDeco = gR1.append("circle")
			.attr("fill","steelblue")
			.attr("cx", 120)
			.attr("cy", 20)
			.attr("r", 10)	
			.style("stroke-width","1px")


		var count = 1;
		while(count < 2){
		resetButton = gR2.append("circle")
			.attr("fill",function (d,i) {if (selCountriesKey[i] == undefined) {return "#CDDDED"} else {return "steelblue"};})
			.attr("cx", 120)
			.attr("cy", 20)
			.attr("r", 8)	
			.style("stroke-width","1px")
				.on("click",clickReset)
				.on("mouseenter",mouseenterReset)
				.on("mouseout",mouseoutReset);
		count++;
		}
		
		var gC4 = canvasOverview.append("g")
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
		.attr("id","gC4");

		
		var mockdata = Array ();
		var totalCountryCountArray = Array();
		
		
		for (i=0;i<CountriesOverview.length;i++){
			if(CountriesOverview[i].value > 0){
				var maxCountriesOverview = i;
				totalCountryCountArray.push(i);
				var length = totalCountryCountArray.length;
				
				
			}
		}
		
		totalCountryCount.push(length);
		totalCountryCount.splice(1,totalCountryCount.length);
		
		var stripCount = totalCountryCount[0]/30 +1;
		
		for (i=1;i<=stripCount;i++){
			mockdata.push(i);
		}

		
		var selStrip = 0;
		
		var overviewStrip = gC4.selectAll(".overviewStrip")
					.data(mockdata)
					.enter()
					.append("rect")
					.attr("fill", fillOverviewStrip)
					.attr("x", 50)
					.attr("y", function(d,i) { return (i * 37.8); })
					.attr("width", 10)	
					.attr("height", 35)
					.style("stroke","steelblue")
						.on("click",clickOverviewStrip);
	
	
		clearStrip(selCountriesKey);
		CountriesOverviewRange(id,minRange,maxRange,minRangeOverview,maxRangeOverview);
		CountriesRange(minRange,maxRange,selCountriesKey,selCountriesValue);
		
		var svgCountriesPie = d3.select("#container2");
		if (!svgCountriesPie.empty()) {
			svgCountriesPie.selectAll('svg').remove()
			}
		
		piechartCountries("#container2", groupByCountries, selCountriesKey, selCountriesValue);
		
		var svgCover = d3.select("#container1");
		if (!svgCover.empty()) {
			svgCover.selectAll('svg').remove()
			}
			
		cover("Filter", groupByCountries, selCountriesKey, selCountriesValue);
		
		var tooltipCountries = d3.selectAll(id)
		.append('tooltipsCountries')
			.style('position','absolute')
			.style('background','#f4f4f4')
			.style('padding-left','5px')
			.style('padding-right','5px')
			.style('border','1px #333 solid')
			.style('border-radius','5px')
			.style('opacity','0')
			.style('color','black')

		var tooltipReset = d3.select(id)
			.append('tooltipsReset')
			.style('position','absolute')
			.style('background','#f4f4f4')
			.style('padding-left','5px')
			.style('padding-right','5px')
			.style('border','1px #333 solid')
			.style('border-radius','5px')
			.style('opacity','0')
			.style('color','black')	

		
	function fillOverviewStrip (v,i){
		
		
		if (i <= maxCountriesOverview/30){
			
			if (i === minRangeOverview/30){ 
				return "steelblue";
				} 
			else { 
				return "#CDDDED";
				}
				} 
		else {
			return "white";
			}				
	}
	
	function clickOverviewStrip (v,i){
	
	
	if (i <= maxCountriesOverview/30){	
	
	minRangeOverview = i*30;
	maxRangeOverview = minRangeOverview + 30;
	minRange = minRangeOverview;
	maxRange = minRangeOverview + 10;
	
	if (minRangeOverview === 0){
		d3.select("#gPrev").selectAll("path").style("fill","white");
			}
	else {
		d3.select("#gPrev").selectAll("path").style("fill","#CDDDED");
			}
			
	if (minRangeOverview <= maxCountriesOverview - 30){
		d3.select("#gNext").selectAll("path").style("fill","#CDDDED");
	}
	else {
		d3.select("#gNext").selectAll("path").style("fill","white");
	}
		
	d3.select("#gC4").selectAll("rect").style("fill",fillOverviewStrip);
	
	d3.select("#gC2").remove();
	d3.select("#gC3").remove();
	CountriesOverviewRange(id,minRange,maxRange,minRangeOverview,maxRangeOverview);
		
	d3.select("#gC1").remove();
	d3.select("#gResult").remove();
	CountriesRange(minRange,maxRange,selCountriesKey,selCountriesValue);
	
	}
	}

	function CountriesOverviewRange(id,minRange,maxRange,minRangeOverview,maxRangeOverview){
		
		
		var CountriesOverviewSubset = CountriesOverview.slice(minRangeOverview,maxRangeOverview);
		
		var x2 = d3.scale.linear()
					.domain([0, d3.max(CountriesOverview, function(v) { return v.value; })])
					.range([10, 35]);
					
		var y2 = d3.scale.ordinal()
				.domain(d3.range(CountriesOverview.length))
				.rangeBands([0, 300]);

		
		var gC2 = canvasOverview.append("g")
				.attr("transform", "translate(" + 0 + "," + 0 + ")")
				.attr("id","gC2");
		
		var myChartOverview = gC2.selectAll(".CountriesOverviewSubset")
			  .data(CountriesOverviewSubset)
			  .enter()
				.append("rect")
				.attr("width", function(v) { if (v.value > 0) {return x2(v.value)} else {return 0}; })	
				.attr("height",8)
				.attr("x",0)
				.attr("y",function (d,i) {return i * 10;})
				.attr("fill", "steelblue")
				.attr("border","1px white solid")
						
		var gC3 = canvasOverview.append("g")
				.attr("transform", "translate(" + 0 + "," + 0 + ")")
				.attr("id","gC3");

		var min_prev;
		var max_prev;
		


		var brush = d3.svg.brush()
			.y(y2)
			.on("brush", brushed);

		for (i=1;i<CountriesOverviewSubset.length;i++){
			if(CountriesOverviewSubset[i].value > 0){
				var maxCountriesOverviewSubset = i;
			}
		}
		
		if(maxCountriesOverviewSubset > 9){
		
		brush.extent([0,100]);
		brush(gC3);
		}
		
		brushCountries = gC3.selectAll("rect")
			.attr("width",40)
			.attr("x",0)
			.style("fill","#667A99")
			.style("stroke","white")
			.style("opacity","0.4")
				.on("mouseenter",mouseenter)
				.on("mouseout",mouseout)
			
	function brushed(){
			//if (d3.event.sourceEvent.type == "brush") return;
			var extent = brush.extent()
			var diff = extent[1] - extent[0]
			var min = extent[0];
			var max = extent[1];
		
			console.log(min);
			
			if ( diff > 100 & max > max_prev){				
				min = extent[0];
				max = extent[0] + 100;
				}
				
			if ( diff > 100 & min < min_prev){				
				max = extent[1];
				min = extent[1] - 100;
				}
			
			if ( diff < 100 & max < max_prev){				
				min = extent[0];
				max = extent[0] + 100;
				}
				
			if ( diff < 100 & min > min_prev){				
				max = extent[1];
				min = extent[1] - 100;
				}
				
			if (diff === 0){
				max = extent[1];
				min = extent[1] - 100;
			}

			if ( min < 0){				
				min = 0;
				max = 100;
				}
				
			
			
			if ( Math.round(max/10) > maxCountriesOverviewSubset){				
					max = Math.max(Math.round(maxCountriesOverviewSubset+1)*10,100);
					min = max - 100;
					}
					
			console.log(maxCountriesOverviewSubset);
					
		brush.extent([min,max]);
		brush(gC3);

		minRange = Math.round(min/10) + minRangeOverview;
		maxRange = Math.round(max/10) + minRangeOverview;		
		
		d3.select("#gC1").remove();
		d3.select("#gResult").remove();
		CountriesRange(minRange,maxRange,selCountriesKey,selCountriesValue);
		
		tooltipCountries.transition()
			.duration(0)
			.style("opacity","0")		
		
		min_prev = min;
		max_prev = max;
		
		}

	function mouseenter(d){
					d3.select(this)
					.style("fill", "brown")
					.style("opacity", "0.4")
					
					
					
					}

	function mouseout(d){
					d3.select(this)
					.style("fill", "#667A99")
					.style("opacity", "0.4");

					
					}					

		
	}
			
	function clickReset(){
					
		if (selCountriesKey.length != 0){
		selCountriesKey.splice(0,selCountriesKey.length);
		selCountriesValue.splice(0,selCountriesValue.length);
		
		d3.select(this)
		.style("fill", "#CDDDED")
		.style("opacity", "1");
		
		d3.select("#gR2Pie").selectAll("circle")
		.style("fill", "#CDDDED")
		.style("opacity", "1");

					
		clearStrip(selCountriesKey);
		
		for (i=0;i<fullSequence.length;i++){
				
		selectFlag[i] = undefined;
		selectedCountries[i] = undefined;
			
			}
				
		minRange = 0;
		maxRange = 10;
		minRangeOverview = 0;
		maxRangeOverview = 30;
		
		
		d3.select("#gC1").remove();
		d3.select("#gResult").remove();
		CountriesRange(minRange,maxRange,selCountriesKey,selCountriesValue);
		
		d3.select("#gC2").remove();
		d3.select("#gC3").remove();
		CountriesOverviewRange(id,minRange,maxRange,minRangeOverview,maxRangeOverview);
		
		d3.select("#gC4").selectAll("rect").style("fill",fillOverviewStrip);
		if (minRangeOverview === 0){
		d3.select("#gPrev").selectAll("path").style("fill","white");
			}
		else {
			d3.select("#gPrev").selectAll("path").style("fill","#CDDDED");
				}
				
		if (minRangeOverview <= maxCountriesOverview - 30){
			d3.select("#gNext").selectAll("path").style("fill","#CDDDED");
		}
		else {
			d3.select("#gNext").selectAll("path").style("fill","white");
		}


		var svgCountriesPie = d3.select("#container2");
		if (!svgCountriesPie.empty()) {
			svgCountriesPie.selectAll('svg').remove()
			}
		piechartCountries("#container2", groupByCountries, selCountriesKey, selCountriesValue);

		var svgCover = d3.select("#container1");
		if (!svgCover.empty()) {
			svgCover.selectAll('svg').remove()
			}
			
		cover("Selection", groupByCountries, selCountriesKey, selCountriesValue);

		}
	}
		
	function mouseenterReset(){
			
			if (selCountriesKey.length != 0){
			d3.select(this)
			.style("fill", "brown")
			.style("opacity", "1")
			
			tooltipReset.transition()
			.duration(100)
			.style("opacity","1");
			
			tooltipReset.html("reset selections")
			.style('left',((d3.event.pageX+10)+'px'))
			.style('top', (d3.event.pageY+10+'px'));
			}
		
		}
		
	function mouseoutReset(){
			
			if(selCountriesKey.length === 0){
			d3.select(this)
			.style("fill", "#CDDDED")
			.style("opacity", "1")
			}
			else {
			d3.select(this)
			.style("fill", "steelblue")
			.style("opacity", "1")
			}
			
			tooltipReset.transition()
			.duration(0)
			.style("opacity","0");
			
			tooltipReset.html("");
		}

	function clearStrip(selCountriesKey){
			
		var mockdata = Array ();
		
		for (i=1;i<=15;i++){
			mockdata.push(i);
		}
		
		var clearStripArray = Array();
		
		for (i=0;i<=selCountriesKey.length;i++){
			if (selCountriesKey[i] != undefined){
			clearStripArray.push(selCountriesKey[i])
			};
		}
		
		var bin = gBins.selectAll(".bins")
					.data(mockdata)
					.enter()
					.append("rect")
					.attr("fill", function (d,i) { if(!clearStripArray[i]){return "#CDDDED"} else {return "steelblue"}})
					.attr("x", function(d,i) { return (i * 6) + 10; })
					.attr("y", 10)
					.attr("width", 4)	
					.attr("height", 20);
					

	}

	function CountriesRange(minRange,maxRange,selCountriesKey,selCountriesValue){
		

		var Countries = CountriesOverview.slice(minRange,maxRange);
		
		var xScale = d3.scale.linear()
			.domain([0, d3.max(Countries, function(v) { return v.value; })])
			.range([0, 250]);
			
		var xAxis = d3.svg.axis()
			.scale(xScale)
			.orient('top')
			.ticks(3)
			.tickPadding(10)
			
		xAxis(xAxisGuide)
		xAxisGuide.attr('transform','translate(10,30)')
		xAxisGuide.selectAll('path')
			.style('fill','none')
			.style('stroke','#000')
		xAxisGuide.selectAll('line')
			.style('stroke','#000')

		var gC1 = canvasCountries.append("g")
			.attr("transform", "translate(" + 160 + "," + 0 + ")")
			.attr("id","gC1");
			
		var x1 = d3.scale.linear()
				.domain([0, d3.max(Countries, function(v) { return v.value; })])
				.range([30, 250]);
		
		var y1 = d3.scale.ordinal()
				.domain(d3.range(Countries.length))
				.rangeBands([0, 330]);
				
		
		var myChart = gC1.selectAll(".Countries")
			  .data(Countries)
			  .enter().append("rect")
				.attr("height", 28)
				.attr("width", function(v) { if (v.value > 0) {return x1(v.value)} else {return 0}; })	
				.attr("x",0)
				.attr("y",function (d,i) {return i * 30;})
				.attr("fill",fill)
					.on("mouseenter", mouseenter)
					.on("mouseout", mouseout)
					.on("click",click);
		
		gC1.selectAll(".text")
		  .data(Countries)
		  .enter()
			  .append("text")
			  .attr("fill","black")
			  .attr("y", function (d,i) {return i * 30 + 16;})
			  .attr("x", -10)
			  .attr("text-anchor", "end")
			  .text(function (d) {if (d.value > 0) {return d.key} else {return ""};})

		repeatAgain();
		
		gResult = CountriesResult.append("g")
								 .attr("id","gResult");
					
		gResult.append("text")
			  .attr("fill","black")
			  .attr("y", 20)
			  .attr("x", 10)
			  .attr("text-anchor", "start")
			  .text("displaying results " + (minRange + 1) + " to " + maxRange + " of total " + (maxCountriesOverview + 1) + " countries" )

			
		var svgCountriesPie = d3.select("#container2");
	
			
		function fillLogic(d,i){

				for (i=0; i<selCountriesKey.length; i++){
				if (d.key == selCountriesKey[i]) {
				return true;
				}
			}
			}
			
		function fill(v,i){
			
			var fillLogicResult = fillLogic(v,i);
			
			if (!fillLogicResult) {
				return "steelblue";
				} 
				else {
				return "black";
				}

			
			}
		
		function repeatAgain(){
		var count = 1;
		while(count < 10)
			{
		var myDeco = gC1.selectAll(".Decobars")
			.data(Countries)
			.enter().append("rect")
				.attr("x", count * 30)
				.attr("y", function(d, i){return i * 30;})
				.attr("width", 2)
				.attr("height", 30)
				.style("fill", "white")
				;
			count++;
			}
		}		
				
		function click(d,i){

			var fillLogicResult = fillLogic(d,i);
			
			
			if (!fillLogicResult) {
			
			d3.select(this)
				.style("fill","black")
				;
				
			d3.select("#gR2").selectAll("circle")
			.style("fill","steelblue")
			.style("opacity", "1");

			selCountriesKey.push(d.key);
			selCountriesValue.push(d.value);
			
			}
				  
			  else {

			selCountriesIndex = selCountriesKey.indexOf(d.key);
	
			selCountriesKey.splice(selCountriesIndex,1);
			selCountriesValue.splice(selCountriesIndex,1);
			
			d3.select(this)
				.style("fill","steelblue");
			
			if (selCountriesKey.length === 0){
			
			d3.select("#gR2").selectAll("circle")
			.style("fill","#CDDDED")
			.style("opacity", "1");

			  }
			  
			  
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d.key){
					var originalSeq = i;
			}
			
			}
			
			selectFlag[originalSeq] = undefined;
			selectedCountries[originalSeq] = undefined;
			
			}
			  
						
			clearStrip(selCountriesKey);
		
			if (!svgCountriesPie.empty()) {
						svgCountriesPie.selectAll('svg').remove()
					  }
			piechartCountries("#container2", groupByCountries,selCountriesKey,selCountriesValue);
			
			var svgCover = d3.select("#container1");
			if (!svgCover.empty()) {
			svgCover.selectAll('svg').remove()
			}
			
			cover("Selection", groupByCountries, selCountriesKey, selCountriesValue);

			}

		function mouseenter(d,i){
			d3.select(this)
			.style("fill", "brown")
			.style("opacity", "1")
			
			tooltipCountries.transition()
			.duration(200)
			.style("opacity","1")
			
			tooltipCountries.html(d.key + " Population " + d3.format(",")(d.value))
			.style('left',((d3.event.pageX+20)+'px'))
			.style('top', (d3.event.pageY+'px'))
			

			}

		function mouseout(d,i){
			
			tooltipCountries.transition()
			.duration(0)
			.style("opacity","0")

			tooltipCountries.html("");

			var fillLogicResult = fillLogic(d,i);
			
			if (!fillLogicResult) {
			
				d3.select(this)
				.style("fill","steelblue");
		   }
			  
		  else {
				d3.select(this)
				.style("fill","black");
		}
		}


	}		

	function piechartCountries(id, groupByCountries, selCountriesKey, selCountriesValue){
		
		var CountriesCumulative = groupByCountries.top(Infinity);
		
		var fullCount = Array();
		
		var filteredCount = Array();
		
		var totalPopulation = Array();
			
		for (i=0;i<CountriesCumulative.length;i++){
				
			totalPopulation.push(CountriesCumulative[i].value);
			}
			
			
		totalPopulationSum.push(d3.sum(totalPopulation));
		
		totalPopulationSum.splice(1,totalPopulationSum.length);
		
		var totalSelPopulation = d3.sum(totalPopulation);		
		
		var totalPopulationArray = Array();
		
		for (i=1;i<=100;i++){
		totalPopulationArray.push(totalPopulationSum[0]/100);
		}
		
		
		for (i=0;i<CountriesCumulative.length;i++){
		if (CountriesCumulative[i].value > 0){
			filteredCount.push(CountriesCumulative[i].key);
		}
		}		
		
		for (i=1;i<=CountriesCumulative.length;i++){
		fullCount.push(i);
		}
		
			
		var radius = Math.min(300, 300) / 2;
		
		var clearCountriesPie = d3.select(id)
		.append("svg")
		.attr("width", 140)
		.attr("height", 40)
		.style("margin-right",10)
		.style('border','1px green solid')

		

		gR1Pie = clearCountriesPie.append('g')
				.attr("id","gR1Pie");
		gR2Pie = clearCountriesPie.append('g')
				.attr("id","gR2Pie");
		gBinsPie = clearCountriesPie.append('g')
				.attr("id","gBinsPie");		
		
		clearStripPie(selCountriesKey);
		


		

		gTPie = clearCountriesPie.append('g')
				.attr("id","gTPie");
				
		resetButtonDecoPie = gR1Pie.append("circle")
			.attr("fill","steelblue")
			.attr("cx", 120)
			.attr("cy", 20)
			.attr("r", 10)	
			.style("stroke-width","1px")

		
		var count = 1;
		while(count < 2){
		resetButtonPie = gR2Pie.append("circle")
			.attr("fill", function (d,i) {if (selCountriesKey[i] == undefined) {return "#CDDDED"} else {return "steelblue"};})
			.attr("cx", 120)
			.attr("cy", 20)
			.attr("r", 8)	
			.style("stroke-width","1px")
				.on("click",clickResetPie)
				.on("mouseenter",mouseenterResetPie)
				.on("mouseout",mouseoutResetPie);
		count++;
		}
		
		var filterText = d3.select(id)
		.append("svg")
		.attr("width", 430)
		.attr("height", 40)
		.style("margin-right",10)
		.style('border','1px blue solid')
		
		var gfilterText = filterText.append("g")
		.attr("transform", "translate(" + 20 + "," + 20 + ")")
		.attr("id","gfilterText");


		var arcPopulation = d3.svg.arc()
		.outerRadius(radius - 20)
		.innerRadius(radius - 40);
		
		var arcCountries = d3.svg.arc()
		.outerRadius(radius - 60)
		.innerRadius(radius - 70);
		
		var arcTotalPopulation = d3.svg.arc()
		.outerRadius(radius - 90)
		.innerRadius(radius - 100);

		var piePopulation = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d.value; });
		
		var pieCountries = d3.layout.pie()
		.sort(null)
		.value(function(d) { return i; });
		
		var pieTotalPopulation = d3.layout.pie()
		.sort(null)
		.value(function(d) { return d; });

		
		var svgwidth = 285
		var svgheight = 300
		
		var svgPie = d3.select(id).append("svg")
		.attr("width",svgwidth)
		.attr("height",svgheight)
		.style('border','1px orange solid')
		
		gfilterText.append("text")
				.attr("fill","black")
				.attr("x",-10)
				.attr("y",5)
				.attr("text-anchor","start")
				.text(textLogicFilter)


		var zoomPie = d3.behavior.zoom()
			.scaleExtent([1, 30])
			.on("zoom",zoomedPie);		

				
		var gPieCanvas = svgPie.append("g")
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
		.attr("id","gPieCanvas")
		.call(zoomPie);
		
		gPieCanvas.append("rect")
					.attr("fill", "white")
					.attr("x", 0)
					.attr("y", 0)
					.attr("width", 285)	
					.attr("height", 300)
					.style("stroke","steelblue")


		var gPieCircle = gPieCanvas.append("g")
		.attr("transform", "translate(" + svgwidth / 2 + "," + svgheight / 2 + ")")
		.attr("id","gPieCircle");
		
		var gPiePopulation = gPieCanvas.append("g")
		.attr("transform", "translate(" + svgwidth / 2 + "," + svgheight / 2 + ")")
		.attr("id","gPiePopulation")
		
		var gPieCountries = gPieCanvas.append("g")
		.attr("transform", "translate(" + svgwidth / 2 + "," + svgheight / 2 + ")")
		.attr("id","gPieCountries");
		
		var gPieTotalPopulation = gPieCanvas.append("g")
		.attr("transform", "translate(" + svgwidth / 2 + "," + svgheight / 2 + ")")
		.attr("id","gPieTotalPopulation");
		
		
		
		gPieCircle.append("circle")
			.attr("cx", 0)
			.attr("cy", 0)
			.attr("r", 50)
			.style("fill", "#678BB0")
			.style("opacity", "0.5")
				 .on("mouseenter", mouseenterCircle)
				 .on("mouseout", mouseoutCircle);
			
		gPieCircle.append("text")
			  .attr("fill","black")
			  .attr("font-size","20px")
			  .attr("y", 5)
			  .attr("x", 0)
			  .attr("text-anchor", "middle")
			  .text(percentage)

		
		
		
		var gArcPopulation = gPiePopulation.selectAll(".arcPopulation")
			.data(piePopulation(CountriesCumulative))
			.enter()
			.append("g")
			  .attr("class", "arcPopulation")
			  ;
				  
		gArcPopulation.append("path")
			 .attr("d", arcPopulation)
			 .style("fill", fillPathPopulation)
			 .style('stroke','white')
			 .style("stroke-width",function (d,i){ return 1/i})
			 .on("click", clickArc)
			 .on("mouseenter", mouseenterArc)
			 .on("mouseout", mouseoutArc);
			 
		var gArcCountries = gPieCountries.selectAll(".arcCountries")
			.data(pieCountries(fullCount))
			.enter()
			.append("g")
			  .attr("class", "arcCountries");
			  
		var tArcCountries = gArcCountries.append("path")
			 .attr("d", arcCountries)
			 .style("fill", "steelblue")
			 .style('border','1px white solid')
			 .style("stroke","none")
				.on("mouseenter", mouseenterArcCountries)
				.on("mouseout", mouseoutArcCountries);
			 
		tArcCountries.transition().duration(1000)
			 .style("fill", fillPathCountries)
			 .attrTween("d",pieTweenCountries)
			 	
		

		var gArcTotalPopulation = gPieTotalPopulation.selectAll(".arcTotalPopulation")
			.data(pieTotalPopulation(totalPopulationArray))
			.enter()
			.append("g")
			  .attr("class", "arcTotalPopulation")
			  ;
			  
		var tArcTotalPopulation = gArcTotalPopulation.append("path")
			 .attr("d", arcTotalPopulation)
			 .style("fill", "steelblue")
			 	.on("mouseenter", mouseenterArcPopulation)
				.on("mouseout", mouseoutArcPopulation);
					 
		tArcTotalPopulation.transition().duration(1000)
			 .style("fill", fillPathTotalPopulation)
			 .attrTween("d",pieTweenPopulaton)
			 
		var svgSelections = d3.select(id).append("svg")
		.attr("width",285)
		.attr("height",300)
		.style('border','1px steelblue solid')
		.style('margin-left','10px')
		
		var zoomBubble = d3.behavior.zoom()
			.scaleExtent([1, 10])
			.on("zoom",zoomedBubble);
		
		gSvgSelections = svgSelections.append('g')
				.attr("transform", "translate(" + 0 + "," + 0 + ")")
				.attr("id","gSvgSelections")
				.call(zoomBubble);

		gSvgPercent = svgSelections.append('g')
				.attr("transform", "translate(" + 0 + "," + 0 + ")")
				.attr("id","gSvgPercent")


		
		
		highlights("#container2", groupByCountries, selCountriesKey, selCountriesValue);

		var svgPieText = d3.select(id).append("svg")
		.attr("width",582)
		.attr("height",40)
		.style('border','1px brown solid')


		var gSvgPieText = svgPieText.append("g")
		.attr("transform", "translate(" + 20 + "," + 20 + ")")
		.attr("id","gSvgPieText");
		


		textupdates();

		var tooltipPopulationPie = d3.select(id)
			.append('tooltipsPopulation')
			.style('position','absolute')
			.style('background','#f4f4f4')
			.style('padding-left','5px')
			.style('padding-right','5px')
			.style('border','1px #333 solid')
			.style('border-radius','5px')
			.style('opacity','0')
			.style('color','black')
			
		function zoomedPie(){

				gPieCanvas.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")

				}

		function zoomedBubble(){

				gSvgSelections.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")

				gSvgPercent.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")")

				}

		function textupdates (){
		
		gSvgPieText.append("text")
				.attr("fill","black")
				.attr("x",0)
				.attr("y",5)
				.attr("text-anchor","start")
				.text(textLogicSelection)
			
		}
		
		function percentageText(){
			
			var totalSelPopulation = d3.sum(selCountriesValue);
			
			var temp = Array();
			
			for (i=0;i<CountriesCumulative.length;i++){
				
			temp.push(CountriesCumulative[i].value);
			}
			var totalPopulation = d3.sum(temp);
			
			var percentage = totalSelPopulation/totalPopulation;

			return percentage;
		}

		function textLogicSelection (){
			
			
			var percentage = percentageText();
			
			if (selCountriesKey.length === 0){
			var	percentageFormat = "";
			} else {
			var percentageFormat = d3.format(".00%")(percentage);
			}
			
			if (selCountriesKey.length > 1){

			if (totalPopulationSum[0] != totalSelPopulation){
				
			if (percentage < 0.01){
			
			return "Selected countries represents negligible % of the filtered subset"
			
			} else {

			return "Selected countries represent about " + percentageFormat + " population of the filtered subset";

			}
			}
			else {
				
			if (percentage < 0.005){
			
			return "Selected countries represents negligible % of total world population"

			
			} 
			else {
			
			return "Selected countries represent about " + percentageFormat + " population of total"

			}
			}
			}
			
			if (selCountriesKey.length === 0) {
				
			return "No countries selected";
			
			}
			
			if (selCountriesKey.length === 1) {
				
			if (totalPopulationSum[0] != totalSelPopulation){
				
			if (percentage < 0.01){
			
			return "Selected country - " + selCountriesKey + " represents negligible % of the filtered subset"
			
			} else {

			return "Selected country - " + selCountriesKey + " represents about " + percentageFormat + " population of the filtered subset";

			}
			}
			else {
				
			if (percentage < 0.005){
			
			return "Selected country - " + selCountriesKey + " represents negligible % of total world population"

			
			} 
			else {
			
			return "Selected country - " + selCountriesKey + " represents about " + percentageFormat + " population of total"

			}
			}
			}
			
			
		}
		
		
		function textLogicFilter(){
			
			
			var percentPopulation =  totalSelPopulation/totalPopulationSum[0];
			if (percentPopulation < 0.01){percentPopulation = 0.01};
			percentPopulationFormated = d3.format(".0%")(percentPopulation);

			
			if (percentPopulationFormated === "100%"){
			
			return "No Filters applied";
			
			}
			
			if (percentPopulation > 0.01 & filteredCount.length > 1){
			return "Filter applied to " + filteredCount.length + " countries, representing about " + percentPopulationFormated + " of world population";
			}
			if (percentPopulation <= 0.01 & filteredCount.length > 1) {
			return "Filter applied to " + filteredCount.length + " countries, representing less than " + percentPopulationFormated + " of world population";
			}
			
			if (percentPopulation > 0.01 & filteredCount.length === 1){
			return "Filter applied to " + filteredCount.length + " country, representing about " + percentPopulationFormated + " of world population";
			}
			if (percentPopulation <= 0.01 & filteredCount.length === 1) {
			return "Filter applied to " + filteredCount.length + " country, representing less than " + percentPopulationFormated + " of world population";
			}
			

		}
		
		function clickResetPie(){
					
		if (selCountriesKey.length != 0){
		selCountriesKey.splice(0,selCountriesKey.length);
		selCountriesValue.splice(0,selCountriesValue.length);
		
		d3.select(this)
		.style("fill", "#CDDDED")
		.style("opacity", "1");

		d3.select("#gR2").selectAll("circle")
		.style("fill", "#CDDDED")
		.style("opacity", "1");
					
		clearStrip(selCountriesKey);
		
		for (i=0;i<fullSequence.length;i++){
				
		selectFlag[i] = undefined;
		selectedCountries[i] = undefined;
			
			}
		


		minRange = 0;
		maxRange = 10;
		minRangeOverview = 0;
		maxRangeOverview = 30;
		
		d3.select("#gC2").remove();
		d3.select("#gC3").remove();
		CountriesOverviewRange(id,minRange,maxRange,minRangeOverview,maxRangeOverview);

		d3.select("#gC1").remove();
		d3.select("#gResult").remove();
		CountriesRange(minRange,maxRange,selCountriesKey,selCountriesValue);
				
		d3.select("#gC4").selectAll("rect").style("fill",fillOverviewStrip);
		
		if (minRangeOverview === 0){
		d3.select("#gPrev").selectAll("path").style("fill","white");
			}
		else {
			d3.select("#gPrev").selectAll("path").style("fill","#CDDDED");
				}
				
		if (minRangeOverview <= maxCountriesOverview - 30){
			d3.select("#gNext").selectAll("path").style("fill","#CDDDED");
		}
		else {
			d3.select("#gNext").selectAll("path").style("fill","white");
		}

		var svgCountriesPie = d3.select("#container2");
		if (!svgCountriesPie.empty()) {
			svgCountriesPie.selectAll('svg').remove()
			}
		piechartCountries("#container2", groupByCountries, selCountriesKey, selCountriesValue);

		var svgCover = d3.select("#container1");
		if (!svgCover.empty()) {
			svgCover.selectAll('svg').remove()
			}
			
		cover("Selection", groupByCountries, selCountriesKey, selCountriesValue);

		}
	}
		
		function mouseenterResetPie(){
			
			if (selCountriesKey.length != 0){
			d3.select(this)
			.style("fill", "brown")
			.style("opacity", "1")
			
			tooltipReset.transition()
			.duration(100)
			.style("opacity","1");
			
			tooltipReset.html("reset selections")
			.style('left',((d3.event.pageX+10)+'px'))
			.style('top', (d3.event.pageY+10+'px'));
			}
		
		}
		
		function mouseoutResetPie(){
			
			if(selCountriesKey.length === 0){
			d3.select(this)
			.style("fill", "#CDDDED")
			.style("opacity", "1")
			}
			else {
			d3.select(this)
			.style("fill", "steelblue")
			.style("opacity", "1")
			}
			
			tooltipReset.transition()
			.duration(0)
			.style("opacity","0");
			
			tooltipReset.html("");
		}

		function clearStripPie(selCountriesKey){
			
		var mockdata = Array ();
		
		for (i=1;i<=15;i++){
			mockdata.push(i);
		}
		
		var clearStripArray = Array();
		
		
		for (i=0;i<=selCountriesKey.length;i++){
			if (selCountriesKey[i] != undefined){
			clearStripArray.push(selCountriesKey[i])
			};
		}
		
		
		var binPie = gBinsPie.selectAll(".bins")
					.data(mockdata)
					.enter()
					.append("rect")
					.attr("fill", function (d,i) { if(!clearStripArray[i]){return "#CDDDED"} else {return "steelblue"}})
					.attr("x", function(d,i) { return (i * 6) + 10; })
					.attr("y", 10)
					.attr("width", 4)	
					.attr("height", 20);
					

	}
		
		function percentage (){
			var totalSelPopulation = d3.sum(selCountriesValue);
			var temp = Array();
			
			for (i=0;i<CountriesCumulative.length;i++){
				
			temp.push(CountriesCumulative[i].value);
			}
			var totalPopulation = d3.sum(temp);
			
			var percentage = totalSelPopulation/totalPopulation;

			if (selCountriesKey.length === 0){
				percentage = "";
			} else {
				percentage = d3.format(".00%")(percentage);
			}
			return percentage;
		}
		

		function fillPathCountries(v,i){
		
		if (filteredCount.length < CountriesCumulative.length){
		if (i<=filteredCount.length) {
			return "black";
			} 
			else {
			return "steelblue";
			}
		}
		else {
		return "steelblue";
		}
		}	
		
		function fillPathPopulation(v,i){
		
		function fillLogic(v,i) {
			for (i=0; i<selCountriesKey.length; i++){
				if (v.data.key == selCountriesKey[i]) {
					return true;
				}
				}
		}
		
		var fillLogicResult = fillLogic(v,i);

		if (!fillLogicResult) {return "steelblue"} else {return "black"};
		}

		function fillPathTotalPopulation(v,i){

		if (totalPopulationSum[0] != totalSelPopulation){
		if (v.data*i < totalSelPopulation) {
			return "black";
			} 
			else {
			return "steelblue";
			}
		}
		else {
			return "steelblue";
		}

		}
			
		function fillLogicPie(d,i){

				for (i=0; i<selCountriesKey.length; i++){
				if (d.data.key == selCountriesKey[i]) {
				return true;
				}
			}
			}

		function clickArc (d,i){
			
		var fillLogicResultPie = fillLogicPie(d,i);
	

		if (!fillLogicResultPie){
				
			d3.select(this)
				.style("fill","black")
				.style('opacity','1');
				
			d3.select("#gR2").selectAll("circle")
			.style("fill","steelblue")
			.style("opacity", "1");
			
			d3.select("#gR2Pie").selectAll("circle")
			.style("fill","steelblue")
			.style("opacity", "1");
			
			selCountriesKey.push(d.data.key);
			selCountriesValue.push(d.data.value);
			
			
			}
			
			else {
				
			if (selCountriesKey.length != 0){
			d3.select(this)
				.style("fill","steelblue")
				.style('opacity','1');
				
			selCountriesIndex = selCountriesKey.indexOf(d.data.key);
	
			selCountriesKey.splice(selCountriesIndex,1);
			selCountriesValue.splice(selCountriesIndex,1);
			
			}
			
			if (selCountriesKey.length === 0){
			
			d3.select("#gR2").selectAll("circle")
			.style("fill","#CDDDED")
			.style("opacity", "1");
			
			d3.select("#gR2Pie").selectAll("circle")
			.style("fill","#CDDDED")
			.style("opacity", "1");
			
			}
			
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d.data.key){
					var originalSeq = i;
			}
			
			}
			
			selectFlag[originalSeq] = undefined;
			selectedCountries[originalSeq] = undefined;
			
			}
			
			var svgPie = d3.select("#gPieCircle").select("text");
			if (!svgPie.empty()) {svgPie.remove()}
			
			gPieCircle.append("text")
			  .attr("fill","black")
			  .attr("font-size","20px")
			  .attr("y", 5)
			  .attr("x", 0)
			  .attr("text-anchor", "middle")
			  .text(percentage);
			  
			  
		d3.select("#gC2").remove();
		d3.select("#gC3").remove();

		CountriesOverviewRange(id,minRange,maxRange,minRangeOverview,maxRangeOverview)
		
		d3.select("#gC1").remove();
		d3.select("#gResult").remove();

		CountriesRange(minRange,maxRange,selCountriesKey,selCountriesValue);
		clearStrip(selCountriesKey);
		clearStripPie(selCountriesKey);
		
		d3.select("#gSvgPieText").selectAll("text").remove()
		d3.select("#gSvgPercent").selectAll("text").remove();
		d3.select("#gSvgSelections").selectAll("text").remove();
		d3.select("#gSvgSelections").selectAll("path").remove();
		d3.select("#gSvgSelections").selectAll("rect").remove();
		d3.select("#gSvgSelections").selectAll("circle").remove();
		
		highlights("#container2", groupByCountries, selCountriesKey, selCountriesValue);
		
		textupdates();
		
		var svgCover = d3.select("#container1");
		if (!svgCover.empty()) {
			svgCover.selectAll('svg').remove()
			}
			
		cover("Selection", groupByCountries, selCountriesKey, selCountriesValue);

		
			
		}
		
		function mouseenterArc (d,i){
			
			d3.select(this)
			.style("fill","brown")
			.style("opacity","1");
			
			tooltipPopulationPie.transition()
			.style("opacity","1")
			
			tooltipPopulationPie.html(d.data.key + " with population of " + d3.format(",")(d.data.value))
			.style('left',((d3.event.pageX+20)+'px'))
			.style('top', (d3.event.pageY+20+'px'))

			
		}

		function mouseoutArc (d,i){
			
		
			tooltipPopulationPie.transition()
				.style("opacity","0")

				
			tooltipPopulationPie.html("");
			
			var fillLogicResultPie = fillLogicPie(d,i);
			
			if (!fillLogicResultPie){
				d3.select(this)
				.style("fill","steelblue")
				.style('opacity','1');
			}
			else{
				d3.select(this)
				.style("fill","black")
				.style('opacity','1');
			}
		}

		function mouseenterArcCountries (d,i){
			
			var percentCountries =  filteredCount.length/CountriesCumulative.length;
			percentCountries = d3.format(".00%")(percentCountries);
						
			if (filteredCount.length < CountriesCumulative.length){

			tooltipPopulationPie.transition()
			.style("opacity","1")

			tooltipPopulationPie.html("filter applied to " + filteredCount.length + " countries")
			.style('left',((d3.event.pageX+20)+'px'))
			.style('top', (d3.event.pageY+20+'px'))

			}
			
		}
		
		function mouseoutArcCountries (d,i){
		
			tooltipPopulationPie.transition()
				.style("opacity","0")
		
			tooltipPopulationPie.html("");
		}

		function mouseenterArcPopulation (d,i){
			
			var percentPopulation =  totalSelPopulation/totalPopulationSum[0];
			if (percentPopulation < 0.01){percentPopulation = 0.01};
			percentPopulationFormated = d3.format(".0%")(percentPopulation);
			
			
			if (totalPopulationSum[0] != totalSelPopulation){
		
			tooltipPopulationPie.transition()
			.style("opacity","1")
			
			if (percentPopulation > 0.01){

			tooltipPopulationPie.html("Applied filter represents about " + percentPopulationFormated + " of world population")
			.style('left',((d3.event.pageX+20)+'px'))
			.style('top', (d3.event.pageY+20+'px'))
			}
			else {
			tooltipPopulationPie.html("Applied filter represents less than " + percentPopulationFormated + " of world population")
			.style('left',((d3.event.pageX+20)+'px'))
			.style('top', (d3.event.pageY+20+'px'))
				
			}
			
			}
			
		}
		
		function mouseoutArcPopulation (d,i){
		
			tooltipPopulationPie.transition()
				.style("opacity","0")
		
			tooltipPopulationPie.html("");
		}

		function mouseenterCircle (){
			
			d3.select(this)
			.style("opacity","0.2")

			
			selectCircle = this;
			
			var percentage = percentageText();
			
			if (selCountriesKey.length === 0){
			var	percentageFormat = "";
			} 
			else {
			var percentageFormat = d3.format(".00%")(percentage);
			}
			
			if (percentageFormat.length != 0){

			tooltipPopulationPie.transition()
			.style("opacity","1")
			
			if (totalPopulationSum[0] != totalSelPopulation){
				
			if (percentage < 0.01){
			
			tooltipPopulationPie.html("Selected countries represents negligible % of the filtered subset")
			.style('left',((d3.event.pageX+20)+'px'))
			.style('top', (d3.event.pageY+20+'px'))
			
			} else {

			tooltipPopulationPie.html("Selected countries represent about " + percentageFormat + " population of the filtered subset")
			.style('left',((d3.event.pageX+20)+'px'))
			.style('top', (d3.event.pageY+20+'px'))
			}
			}
			else {
				
			if (percentage < 0.005){
			
			tooltipPopulationPie.html("Selected countries represents negligible % of total world population")
			.style('left',((d3.event.pageX+20)+'px'))
			.style('top', (d3.event.pageY+20+'px'))
			
			} else {
			
			tooltipPopulationPie.html("Selected countries represent about " + percentageFormat + " population of total")
			.style('left',((d3.event.pageX+20)+'px'))
			.style('top', (d3.event.pageY+20+'px'))
			}
			}
			}
			
		}

		function mouseoutCircle (){
		
			
			d3.select(this)
			.style("opacity","0.5")

			selectCircle = undefined;
			
			tooltipPopulationPie.transition()
				.style("opacity","0")
		
			tooltipPopulationPie.html("");

		}

		function pieTweenPopulaton(b){
		b.innerRadius = 0;
		var i = d3.interpolate({startAngle: 0, endAngle: 0},b);
		return function(t) {return arcTotalPopulation(i(t));}
		}
		
		function pieTweenCountries(b){
		b.innerRadius = 0;
		var i = d3.interpolate({startAngle: 0, endAngle: 0},b);
		return function(t) {return arcCountries(i(t));}
		}
		
		}	

	function highlights(id, groupByCountries, selCountriesKey, selCountriesValue){
	

		var lineX = [ { "x": 0,   "y": 120},
					  { "x": 300,   "y": 120}];
					  
		var lineY = [ { "x": 120,   "y": 0},
					  { "x": 120,   "y": 300}];				
		
		var lineXcountries = gSvgSelections.append("path")
					.attr("d", lineFunction(lineX))
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 2);
					
		var lineYcountries = gSvgSelections.append("path")
					.attr("d", lineFunction(lineY))
                    .attr("stroke", "steelblue")
                    .attr("stroke-width", 2);
					
		gSvgSelections.append("text")
			  .attr("fill","black")
			  .attr("y", 110)
			  .attr("x", 10)
			  .attr("text-anchor", "start")
			  .text("small");
			  
		gSvgSelections.append("text")
			  .attr("fill","black")
			  .attr("y", 110)
			  .attr("x", 270)
			  .attr("text-anchor", "end")
			  .text("medium");
			  
		gSvgSelections.append("text")
			  .attr("fill","black")
			  .attr("y", 140)
			  .attr("x", 10)
			  .attr("text-anchor", "start")
			  .text("large");
			  
		gSvgSelections.append("text")
			  .attr("fill","black")
			  .attr("y", 140)
			  .attr("x", 270)
			  .attr("text-anchor", "end")
			  .text("mega");

		gSvgSelections.append("circle")
			.style("stroke", "steelblue")
			.style("fill", "white")
			.attr("r",30)
			.attr("cx",120)
			.attr("cy",120);
			
		gSvgPercent.append("text")
			  .attr("fill","black")
			  .attr("x", 120)
			  .attr("y", 120)
			  .attr("dx", 0)
			  .attr("dy", ".3em")
			  .attr("text-anchor", "middle")
			  .attr("font-size","20px")
			  .text(textHighlights);
			

		
		gSvgSelections.append("circle")
			.style("stroke", "steelblue")
			.style("fill", "grey")
			.style("opacity","0.1")
			.attr("r",30)
			.attr("cx",120)
			.attr("cy",120)
				.on("mouseenter",mouseenterHighlights)
				.on("mouseout",mouseoutHighlights);
			
		
		var svgSmall = gSvgSelections.append("rect")
				.attr("id","small")
				.attr("x", 0)
				.attr("y", 0)
				.attr("width", 120)
				.attr("height", 120)
				.style("fill", "white")
				.style('opacity','0.1')
				.style("stroke", "none")
				

				
		gSvgSmall = gSvgSelections.append('g')
				.attr("transform", "translate(" + 0 + "," + 0 + ")")
				.attr("id","gSvgSmall")
				
		var widthSmall = 120;
		var heightSmall = 100;
		var radiusSmall = 3;
		
		
		inputSmall = d3.range(400).map(function() {
		  return {
			x: Math.round(Math.random()* (widthSmall - radiusSmall * 2) + radiusSmall),
			y: Math.round(Math.random()* (heightSmall - radiusSmall * 2) + radiusSmall)
		  };
		});

				
		var dragSmall = d3.behavior.drag()
			.on("drag", draggedSmall)
			

			
		var selectionsSmall = gSvgSmall.selectAll(".selectionsSmall")
			.data(selCountriesKey)
			.enter()
			.append("circle")
			.attr("r",inputR1Small)
			.attr("cx",inputX1Small)
			.attr("cy",inputY1Small)
			.style("stroke", "steelblue")
			.style("stroke-width","2px")
			.style("fill", fillLogicSelections)
			.style('opacity','1')
				.on("mouseenter",mouseenterSelections)
				.on("mouseout",mouseoutSelections)
				.on("click",clickSelections)
				.call(dragSmall);
				
		selectionsSmall.transition()
			.attr("r",inputRSmall)
			.attr("cx",inputXSmall)
			.attr("cy",inputYSmall)
			.duration(1000)
			.delay(50)
			.ease('elastic');

		
		
		var svgMedium = gSvgSelections.append("rect")
				.attr("id","medium")
				.attr("x", 120)
				.attr("y", 0)
				.attr("width", 165)
				.attr("height", 120)
				.style("fill", "white")
				.style('opacity','0.1')
				.style("stroke", "none")
				

				
		gSvgMedium = gSvgSelections.append('g')
				.attr("transform", "translate(" + 120 + "," + 0 + ")")
				.attr("id","gSvgMedium")

		var widthMedium = 165;
		var heightMedium = 100;
		var radiusMedium = 8;
				
		inputMedium = d3.range(400).map(function() {
		  return {
			x: Math.round(Math.random()* (widthMedium - radiusMedium * 2) + radiusMedium),
			y: Math.round(Math.random()* (heightMedium - radiusMedium * 2) + radiusMedium)
		  };
		});
		
		var dragMedium = d3.behavior.drag()
			.on("drag", draggedMedium)


		var selectionsMedium = gSvgMedium.selectAll(".selectionsMedium")
			.data(selCountriesKey)
			.enter()
			.append("circle")
			.attr("r",inputR1Medium)
			.attr("cx",inputX1Medium)
			.attr("cy",inputY1Medium)
			.style("stroke", "steelblue")
			.style("stroke-width","2px")
			.style("fill", fillLogicSelections)
			.style('opacity','1')
				.on("mouseenter",mouseenterSelections)
				.on("mouseout",mouseoutSelections)
				.on("click",clickSelections)
				.call(dragMedium);
				
		selectionsMedium.transition()
			.attr("r",inputRMedium)
			.attr("cx",inputXMedium)
			.attr("cy",inputYMedium)
			.duration(1000)
			.delay(50)
			.ease('elastic');

		
		
		var svgLarge = gSvgSelections.append("rect")
				.attr("id","large")
				.attr("x", 0)
				.attr("y", 120)
				.attr("width", 120)
				.attr("height", 180)
				.style("fill", "white")
				.style('opacity','0.1')
				.style("stroke", "none")
				

				
		gSvgLarge = gSvgSelections.append('g')
				.attr("transform", "translate(" + 0 + "," + 140 + ")")
				.attr("id","gSvgLarge")

		var widthLarge = 120;
		var heightLarge = 160;
		var radiusLarge = 10;

		inputLarge = d3.range(400).map(function() {
		  return {
			x: Math.round(Math.random()* (widthLarge - radiusLarge * 2) + radiusLarge),
			y: Math.round(Math.random()* (heightLarge - radiusLarge * 2) + radiusLarge)
		  };
		});
		
		
		var dragLarge = d3.behavior.drag()
			.on("drag", draggedLarge)
			

		var selectionsLarge = gSvgLarge.selectAll(".selectionsLarge")
			.data(selCountriesKey)
			.enter()
			.append("circle")
			.attr("r",inputR1Large)
			.attr("cx",inputX1Large)
			.attr("cy",inputY1Large)
			.style("stroke", "steelblue")
			.style("stroke-width","2px")
			.style("fill", fillLogicSelections)
			.style('opacity','1')
				.on("mouseenter",mouseenterSelections)
				.on("mouseout",mouseoutSelections)
				.on("click",clickSelections)
				.call(dragLarge);
				
		selectionsLarge.transition()
			.attr("r",inputRLarge)
			.attr("cx",inputXLarge)
			.attr("cy",inputYLarge)
			.duration(1000)
			.delay(50)
			.ease('elastic');
			
			

		var svgMega = gSvgSelections.append("rect")
				.attr("id","mega")
				.attr("x", 120)
				.attr("y", 120)
				.attr("width", 165)
				.attr("height", 180)
				.style("fill", "white")
				.style('opacity','0.1')
				.style("stroke", "none")
				

				
		gSvgMega = gSvgSelections.append('g')
				.attr("transform", "translate(" + 120 + "," + 140 + ")")
				.attr("id","gSvgMega")

		var widthMega = 165;
		var heightMega = 160;
		var radiusMega = 20;

		inputMega = d3.range(400).map(function() {
		  return {
			x: Math.round(Math.random() * (widthMega - radiusMega * 2) + radiusMega),
			y: Math.round(Math.random() * (heightMega - radiusMega * 2) + radiusMega)
		  };
		});
		
		
		var dragMega = d3.behavior.drag()
			.on("drag", draggedMega)

		
		
		var selectionsMega = gSvgMega.selectAll(".selectionsMega")
			.data(selCountriesKey)
			.enter()
			.append("circle")
			.attr("r",inputR1Mega)
			.attr("cx",inputX1Mega)
			.attr("cy",inputY1Mega)
			.style("stroke", "steelblue")
			.style("stroke-width","2px")
			.style("fill", fillLogicSelections)
			.style('opacity','0.8')
				.on("mouseenter",mouseenterSelections)
				.on("mouseout",mouseoutSelections)
				.on("click",clickSelections)
				.call(dragMega);
				
		selectionsMega.transition()
			.attr("r",inputRMega)
			.attr("cx",inputXMega)
			.attr("cy",inputYMega)
			.duration(1000)
			.delay(50)
			.ease('elastic');

		var tooltipsHighlights = d3.select(id)
			.append('tooltipsPopulation')
			.style('position','absolute')
			.style('background','#f4f4f4')
			.style('padding-left','5px')
			.style('padding-right','5px')
			.style('border','1px #333 solid')
			.style('border-radius','5px')
			.style('opacity','0')
			.style('color','black')



		function mouseenterHighlights (d,i){
			
		d3.select(this)
			.style("opacity", "0.4");
			

			var highlights = textHighlights(d,i);
			
			
			if (highlights != "") {
			tooltipsHighlights.transition()
			.duration(100)
			.style("opacity","1");
			
			tooltipsHighlights.html("Highlighted countries contribute to about " + highlights + " percent population of all selected countries")
			.style('left',((d3.event.pageX+10)+'px'))
			.style('top', (d3.event.pageY+10+'px'));
			
			}
			
			if (highlights == "0%") {
			tooltipsHighlights.transition()
			.duration(100)
			.style("opacity","1");
			
			tooltipsHighlights.html("Highlighted countries represent negligible percentage population of all selected countries")
			.style('left',((d3.event.pageX+10)+'px'))
			.style('top', (d3.event.pageY+10+'px'));
			
		}
		}
		
		function mouseoutHighlights (){

		d3.select(this)
			.style("opacity", "0.1");

		tooltipsHighlights.transition()
			.duration(0)
			.style("opacity","0");
			
			tooltipsHighlights.html("");		
			
		}

			
		function selectionPercentage (){
		
		

		}
			
		function fillLogicSelections (d,i){
			
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}
		
		if 	(!selectFlag[originalSeq]){
		return "#CDDDED";	
		}
		else {
		return "steelblue";
		}
		
		}
		
		function mouseenterSelections (d,i){
			
		d3.select(this)
		.style("fill", "brown")
		
		
		
		tooltipsHighlights.transition()
		.duration(200)
		.style("opacity","1")
		
		tooltipsHighlights.html(selCountriesKey[i] + " with population of " + d3.format(",")(selCountriesValue[i]))
		.style('left',((d3.event.pageX+20)+'px'))
		.style('top', (d3.event.pageY+'px'))
		
		}	
		
		function mouseoutSelections (d,i){
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			if (!selectFlag[originalSeq]){
			d3.select(this)
			.style("fill","#CDDDED");
		}
		
		else {
			d3.select(this)
			.style("fill","steelblue");
		}
		
		tooltipsHighlights.transition()
		.duration(0)
		.style("opacity","0");
		
		tooltipsHighlights.html("");

			
		}
		
		function clickSelections (d,i){
		
		
		for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}



		if (!selectFlag[originalSeq]){
			
			d3.select(this)
			.style("fill", "steelblue")

		
			selectFlag[originalSeq] = "true";
		}
		
		else {
			
			d3.select(this)
			.style("fill","#CDDDED");
			
			selectFlag[originalSeq] = undefined;
		}
		
		textHighlights (d,i);
		
		}
		
		function textHighlights (d,i){
		
		var selCountriesSum = d3.sum(selCountriesValue);
		var highlightedValues = Array();
		
		for (i=0;i<fullSequence.length;i++){
		
		if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
		}
		
		for (i=0;i<fullSequence.length;i++){
		
		if(selectFlag[i] == "true"){
			highlightedValues.push(fullSequence[i].Population)
		}
		}
		
		var highlightedSum = d3.sum(highlightedValues);
		
		
		
		var highlightedPercent = highlightedSum/selCountriesSum;
		
		
		var formattedPercent = d3.format(".00%")(highlightedPercent);
		
		if (!highlightedPercent){
			var highlights = "";
		}
		else {
			var highlights = formattedPercent;
		}
				
		d3.select("#gSvgPercent").selectAll("text").remove()
		
		gSvgPercent.append("text")
			  .attr("fill","black")
			  .attr("x", 120)
			  .attr("y", 120)
			  .attr("dx", 0)
			  .attr("dy", ".3em")
			  .attr("text-anchor", "middle")
			  .attr("font-size","20px")
			  .text(highlights);
		
		return highlights;
			  
		}

		
		function draggedSmall (d,i) {

		var width = widthSmall;
		var height = heightSmall;
		var radius = radiusSmall + selCountriesValue[i]/20000;
		
			d3.select(this)
				.attr("cx", d.x = Math.max(radius,Math.min(width - radius, d3.event.x)))
				.attr("cy", d.y = Math.max(radius,Math.min(height - radius, d3.event.y)))
				
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}


			cx[originalSeq] = Math.max(radius,Math.min(width - radius, d3.event.x));
			cy[originalSeq] = Math.max(radius,Math.min(height - radius, d3.event.y));
						
		}

		function draggedMedium (d,i) {

		var width = widthMedium;
		var height = heightMedium;
		var radius = radiusMedium + selCountriesValue[i]/200000;
		
		d3.select(this)
				.attr("cx", d.x = Math.max(radius,Math.min(width - radius, d3.event.x)))
				.attr("cy", d.y = Math.max(radius,Math.min(height - radius, d3.event.y)))
				
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}


			cx[originalSeq] = Math.max(radius,Math.min(width - radius, d3.event.x));
			cy[originalSeq] = Math.max(radius,Math.min(height - radius, d3.event.y));
				
		
		}

		function draggedLarge (d,i) {

		var width = widthLarge;
		var height = heightLarge;
		var radius = radiusLarge + selCountriesValue[i]/1000000;
		
		d3.select(this)
				.attr("cx", d.x = Math.max(radius,Math.min(width - radius, d3.event.x)))
				.attr("cy", d.y = Math.max(radius,Math.min(height - radius, d3.event.y)))
				
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}


			cx[originalSeq] = Math.max(radius,Math.min(width - radius, d3.event.x));
			cy[originalSeq] = Math.max(radius,Math.min(height - radius, d3.event.y));
				
		
		}

		function draggedMega (d,i) {

		var width = widthMega;
		var height = heightMega;
		var radius = radiusMega + selCountriesValue[i]/100000000;
		
		d3.select(this)
				.attr("cx", d.x = Math.max(radius,Math.min(width - radius, d3.event.x)))
				.attr("cy", d.y = Math.max(radius,Math.min(height - radius, d3.event.y)))
				
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}


			cx[originalSeq] = Math.max(radius,Math.min(width - radius, d3.event.x));
			cy[originalSeq] = Math.max(radius,Math.min(height - radius, d3.event.y));
				
		
		}

		

		function inputR1Small (d,i){
			
			var seq = i;
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			if(!selectedCountries[originalSeq]){
				return 0;
				} 
				else {
				var inputR1 = inputRSmall(d,seq);
				return inputR1;
				}
				
			}

		function inputR1Medium (d,i){
			
			var seq = i;
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			if(!selectedCountries[originalSeq]){
				return 0;
				} 
				else {
				var inputR1 = inputRMedium(d,seq);
				return inputR1;
				}
				
			}

		function inputR1Large (d,i){
			
			var seq = i;
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			if(!selectedCountries[originalSeq]){
				return 0;
				} 
				else {
				var inputR1 = inputRLarge(d,seq);
				return inputR1;
				}
				
			}

		function inputR1Mega (d,i){
			
			var seq = i;
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			if(!selectedCountries[originalSeq]){
				return 0;
				} 
				else {
				var inputR1 = inputRMega(d,seq);
				return inputR1;
				}
				
			}
			

		function inputRSmall (d,i) {
			
			
			if(selCountriesValue[i] > 1 & selCountriesValue[i] < 100000) {
			
			return radiusSmall + selCountriesValue[i]/20000;		
			}
			else {
				return 0;
			}
			
		}

		function inputRMedium (d,i) {
			
			if(selCountriesValue[i] > 100000 & selCountriesValue[i] < 1000000) {
		
			return radiusMedium + selCountriesValue[i]/200000;		
			
			}
			else {
				return 0;
			}
			
		}

		function inputRLarge (d,i) {
			
			if(selCountriesValue[i] > 1000000 & selCountriesValue[i] < 10000000) {
			return radiusLarge + selCountriesValue[i]/1000000;		
			
			}
			else {
				return 0;
			}
		}

		function inputRMega (d,i) {
			
			if(selCountriesValue[i] > 10000000 & selCountriesValue[i] < 2000000000) {
			return radiusMega + selCountriesValue[i]/100000000;
			}
			else {
			return 0;
			}
		}

		
		
		function inputX1Small (d,i){
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}
			

			
			if(!selectedCountries[originalSeq]){
				
				return 120;
				
				} 
				
				else {
				
				var inputX1 = inputXSmall(d,i);
				
				return inputX1;
				
				}
				
			}
			
		function inputY1Small (d,i){
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}
			

			if(!selectedCountries[originalSeq]){
				return 120;
				} 
				else {
				var inputY1 = inputYSmall(d,i);
				return inputY1;
				}
				
			}
		
		function inputXSmall (d,i) {
			

			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
						
			}
			
				
			selectedCountries[originalSeq] = "true";
		
			if (cx[originalSeq] != undefined){ return cx[originalSeq];} else {
				
			if (!xPrevSmall[originalSeq]){
			
			var x = inputSmall[originalSeq].x;
			
			xPrevSmall[originalSeq] = x;
			
			return x;
			
			}
			
			else {
				
			return xPrevSmall[originalSeq];
			
			}
			}
		
			
		
				
		}
		
		function inputYSmall (d,i) {
		
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			selectedCountries[originalSeq] = "true";
		
			if (cy[originalSeq] != undefined){ return cy[originalSeq];} else {
				
			if (!yPrevSmall[originalSeq]){
			
			var y = inputSmall[originalSeq].y;
			
			yPrevSmall[originalSeq] = y;
			
			return y;
			
			}
			
			else {
				
			return yPrevSmall[originalSeq];
			
			}
			}
					
		}
			

		function inputX1Medium (d,i){

			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}
			


		if(!selectedCountries[originalSeq]){
				return 0;
				} 
				else {
				var inputX1 = inputXMedium(d,i);
				return inputX1;
				}
				
			}
			
		function inputY1Medium (d,i){
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			if(!selectedCountries[originalSeq]){
				return 120;
				} 
				else {
				var inputY1 = inputYMedium(d,i);
				return inputY1;
				}
				
			}
		
		function inputXMedium (d,i) {
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			selectedCountries[originalSeq] = "true";
		
			if (cx[originalSeq] != undefined){ return cx[originalSeq];} else {
				
			if (!xPrevMedium[originalSeq]){
			
			var x = inputMedium[originalSeq].x;
			
			xPrevMedium[originalSeq] = x;

			return x;
			
			}
			
			else {
				
			return xPrevMedium[originalSeq];
			
			}
			}
						
		}
		
		function inputYMedium (d,i) {
		
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			selectedCountries[originalSeq] = "true";
		
			if (cy[originalSeq] != undefined){ return cy[originalSeq];} else {
				
			if (!yPrevMedium[originalSeq]){
			
			var y = inputMedium[originalSeq].y;
			
			yPrevMedium[originalSeq] = y;
			
			return y;
			
			}
			
			else {
				
			return yPrevMedium[originalSeq];
			
			}
			}
					
		}

		
		
		function inputX1Large (d,i){


			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			if(!selectedCountries[originalSeq]){
				return 120;
				} 
				else {
				var inputX1 = inputXLarge(d,i);
				return inputX1;
				}
				
			}
			
		function inputY1Large (d,i){
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			if(!selectedCountries[originalSeq]){
				return 0;
				} 
				else {
				var inputY1 = inputYLarge(d,i);
				return inputY1;
				}
				
			}
		
		function inputXLarge (d,i) {
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			selectedCountries[originalSeq] = "true";
		
			if (cx[originalSeq] != undefined){ return cx[originalSeq];} else {
				
			if (!xPrevLarge[originalSeq]){
			
			var x = inputLarge[originalSeq].x;
			
			xPrevLarge[originalSeq] = x;

			return x;
			
			}
			
			else {
				
			return xPrevLarge[originalSeq];
			
			}
		}
		}
		
		function inputYLarge (d,i) {
		
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			selectedCountries[originalSeq] = "true";
		
			if (cy[originalSeq] != undefined){ return cy[originalSeq];} else {
				
			if (!yPrevLarge[originalSeq]){
			
			var y = inputLarge[originalSeq].y;
			
			yPrevLarge[originalSeq] = y;

			return y;
			
			}
			
			else{
			
			return yPrevLarge[originalSeq];
			
			}
					
		}
	}
		

		
		function inputX1Mega (d,i){

			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			if(!selectedCountries[originalSeq]){
				return 0;
				} 
				else {
				var inputX1 = inputXMega(d,i);
				return inputX1;
				}
				
			}
			
		function inputY1Mega (d,i){
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			if(!selectedCountries[originalSeq]){
				return 0;
				} 
				else {
				var inputY1 = inputYMega(d,i);
				return inputY1;
				}
				
			}
		
		function inputXMega (d,i) {
			
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			selectedCountries[originalSeq] = "true";
			
			
			if (cx[originalSeq] != undefined){ return cx[originalSeq];} else {
				
			if (!xPrevMega[originalSeq]){
			
			var x = inputMega[originalSeq].x;
			
			xPrevMega[originalSeq] = x;
			
			return x;
			
			}
			
			else{
				
			return xPrevMega[originalSeq];
			
			}
		}
		}
		
		function inputYMega (d,i) {
		
			for (i=0;i<fullSequence.length;i++){
				
				if (fullSequence[i].CountryEnglish == d){
					var originalSeq = i;
			}
			
			}

			selectedCountries[originalSeq] = "true";
		
			if (cy[originalSeq] != undefined){ return cy[originalSeq];} else {
			
			if (!yPrevMega[originalSeq]){
			
			var y = inputMega[originalSeq].y;

			yPrevMega[originalSeq] = y;
			
			return y;
			
			}
			
			else{
				
			return yPrevMega[originalSeq];
			
			}
					
		}
		}



			}		

	function cover(id, groupByCountries, selCountriesKey, selCountriesValue){
		
		
		var CountriesCumulative = groupByCountries.top(Infinity);

		var CoverCanvas = d3.select("#container1")
			.append("svg")
			.attr("width", 600)
			.attr("height", 400)
			.style("border","1px white solid")
			.style("margin-right","10px")
			
		var gPopulationImage = CoverCanvas.append("g")
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
		.attr("id","gPopulationText");

		var gPopulationSource = CoverCanvas.append("g")
		.attr("transform", "translate(" + 0 + "," + 0 + ")")
		.attr("id","gPopulationText");		
		
		var gPopulationText = CoverCanvas.append("g")
		.attr("transform", "translate(" + 400 + "," + 250 + ")")
		.attr("id","gPopulationText");
		
		gPopulationImage.append("svg:image")
		   .attr('x',0)
		   .attr('y',0)
		   .attr('width', 600)
		   .attr('height', 400)
		   .attr("xlink:href","PIC/world population1.jpg")
		
		var totalPopulation = Array();
			
		for (i=0;i<CountriesCumulative.length;i++){
				
			totalPopulation.push(CountriesCumulative[i].value);
			
			}

		var totalSelPopulation = d3.sum(totalPopulation);		

		gPopulationSource.append("text")
				.attr("fill","white")
				.attr("opacity","0.9")
				.attr("x", 20)
				.attr("y", 20)
				.attr("text-anchor", "start")
				.attr("font-family", "Anton")
				.attr("font-size","15px")
				.attr("transform", "translate(0,0) rotate(0)")
				.text("http://www.geonames.org/countries/");

		gPopulationText.append("text")
				.attr("fill","#C8D6EC")
				.attr("opacity","0.8")
				.attr("x", -300)
				.attr("y", 80)
				.attr("text-anchor", "start")
				.attr("font-family", "Anton")
				.attr("font-size","30px")
				.attr("transform", "translate(20,10) rotate(0)")
				.text(titleLogicFilter);
		

		var animatedText = gPopulationText.append("text")
			.attr("fill","#C8D6EC")
				.attr("opacity","0.8")
				.attr("x", -30)
				.attr("y", 80)
				.attr("text-anchor", "start")
				.attr("font-family", "Anton")
				.attr("font-size","30px")
				.attr("transform", "translate(20,10) rotate(0)")
				.text(textLogicFilter)

		
		animatedText.transition()
					.duration(1000)
					.tween('text',tweenText(totalSelPopulation));

		gPopulationText.append("text")
			.attr("fill","#C8D6EC")
				.attr("opacity","0.8")
				.attr("x", -300)
				.attr("y", 120)
				.attr("text-anchor", "start")
				.attr("font-family", "Anton")
				.attr("font-size","20px")
				.attr("transform", "translate(20,10) rotate(0)")
				.text(titleLogicSelection);
		
		var SelPopulation = d3.sum(selCountriesValue);


		var animatedText = gPopulationText.append("text")
			.attr("fill","#C8D6EC")
				.attr("opacity","0.8")
				.attr("x", -30)
				.attr("y", 120)
				.attr("text-anchor", "start")
				.attr("font-family", "Anton")
				.attr("font-size","20px")
				.attr("transform", "translate(20,10) rotate(0)")
				.text(textLogicSelection)

		
		animatedText.transition()
					.duration(1000)
					.tween('text',tweenText(SelPopulation));
					
		
		function titleLogicFilter(){
			

		if (totalSelPopulation < totalPopulationSum[0]){
				return "Filtered Population";
		}
		else {
			
				return "Total Population";
		}
		}
		
		function titleLogicSelection(){
			
			if (selCountriesKey.length === 1){
				
				return "Selected Country Population";
		}

		
			if (selCountriesKey.length != 1){
				
				return "Selected Countries Population";
		}
		}
		
		function textLogicFilter(){
			if (id == "Filter"){
				return 0;
			}
			else{
				return totalSelPopulation;
			}
		}
		
		function textLogicSelection(){
			if (id == "Selection"){
				return 0;
			}
			else{
				return SelPopulation;
			}
		}
		
		function tweenText(newValue) {
			return function(){
				var currentValue = +this.textContent;
				var i = d3.interpolateRound(currentValue,newValue);
			
			return function(t){
				this.textContent = i(t);
			};
		}
		
		}


		
	}
			
		
	function clickNextThirty (){
		
	
	if (minRangeOverview <= maxCountriesOverview - 30){
		
	minRangeOverview = minRangeOverview + 30;
	maxRangeOverview = maxRangeOverview + 30;
	minRange = minRangeOverview;
	maxRange = minRangeOverview + 10;

	}

	
	if (minRangeOverview <= maxCountriesOverview - 30){
		d3.select(this).style("fill","#CDDDED");
	}
	else {
		d3.select(this).style("fill","white");
	}
	
	if (minRangeOverview === 0){
		d3.select("#gPrev").selectAll("path").style("fill","white");
			}
	else {
		d3.select("#gPrev").selectAll("path").style("fill","#CDDDED");
			}
	
	d3.select("#gC2").remove();
	d3.select("#gC3").remove();
	CountriesOverviewRange(id,minRange,maxRange,minRangeOverview,maxRangeOverview);
	
	d3.select("#gC4").selectAll("rect").style("fill",fillOverviewStrip);
	
	
	d3.select("#gC1").remove();
	d3.select("#gResult").remove();
	CountriesRange(minRange,maxRange,selCountriesKey,selCountriesValue);
		
	}

	function clickPrevThirty (){
	
	if (minRangeOverview > 0){
	
	
	minRangeOverview = minRangeOverview - 30;
	maxRangeOverview = maxRangeOverview - 30;
	minRange = minRangeOverview;
	maxRange = minRangeOverview + 10;

	}
	
	
	if (minRangeOverview === 0){
		d3.select(this).style("fill","white");
			}
	else {
		d3.select(this).style("fill","#CDDDED");
			}
			
	if (minRangeOverview <= maxCountriesOverview - 30){
		d3.select("#gNext").selectAll("path").style("fill","#CDDDED");
	}
	else {
		d3.select("#gNext").selectAll("path").style("fill","white");
	}


	d3.select("#gC2").remove();
	d3.select("#gC3").remove();
	CountriesOverviewRange(id,minRange,maxRange,minRangeOverview,maxRangeOverview);
	
	d3.select("#gC4").selectAll("rect").style("fill",fillOverviewStrip);
	

	d3.select("#gC1").remove();
	d3.select("#gResult").remove();
	CountriesRange(minRange,maxRange,selCountriesKey,selCountriesValue);
	
	}

	function fillNextThirty (){
		
	
	if (minRangeOverview <= maxCountriesOverview - 30){
		return "#CDDDED";
	}
	else {
		return "white";
	}

	}

	function fillPrevThirty (){
	
	
	if (minRangeOverview === 0){
		return "white";
	}
	else {
		
		return "#CDDDED";
	}		
	}

	function mouseenterNextThirty (){
			
	if (minRangeOverview <= maxCountriesOverview - 30){
		d3.select(this).style("fill","steelblue");
	}
	}

	function mouseenterPrevThirty (){	
	
	if (minRangeOverview != 0){
		d3.select(this).style("fill","steelblue");
	}
	}	

	function mouseoutNextThirty (){
			
	if (minRangeOverview <= maxCountriesOverview - 30){
		d3.select(this).style("fill","#CDDDED");
	}
	}

	function mouseoutPrevThirty (){	
	
	if (minRangeOverview != 0){
		d3.select(this).style("fill","#CDDDED");
	}
	}	

	}


	});


		


	