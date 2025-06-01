var tree;
var test_iterations = 1000;
var bin_intervals = 0.5;
var capacitor_value = 0.000001;
var capacitor_tolerance = 10;
var inductor_value = 8;
var inductor_tolerance = 10;

var capacitor_min = capacitor_value*(1-capacitor_tolerance/100);
var capacitor_max = capacitor_value*(1+capacitor_tolerance/100);
var capacitor_range = capacitor_max - capacitor_min;

var inductor_min = inductor_value*(1-inductor_tolerance/100);
var inductor_max = inductor_value*(1+inductor_tolerance/100);
var inductor_range = inductor_max - inductor_min;

var data = new Array();

var cheight = document.getElementsByClassName('row')[0].clientHeight;
var cwidth = document.getElementById("d3exampleContainer").clientWidth;

var svgMargin = {top: 20, right: 10, bottom: 20, left: 50};
var bar_margin = 2;
var text_legend_height = 40;

var svgWidth = cwidth - svgMargin.left - svgMargin.right,
  svgHeight = cheight - svgMargin.top - svgMargin.bottom - text_legend_height;

function d3exampleRun() {
	
	
	document.getElementById('iter').value = "1000";
	document.getElementById('deltaBins').value = "0.5";
	document.getElementById('capVal').value = "0.000001";
	document.getElementById('capTol').value = "10";
	document.getElementById('lVal').value = "8";
	document.getElementById('lTol').value = "10";
	
  
	getData();
  
	var xScale = d3.scaleBand().range([0, svgWidth]).round(0.1);

	var y = d3.scaleLinear()
	  .range([svgHeight, 0]);

	var xAxis = d3.axisBottom().scale(xScale);

	var yAxis = d3.axisLeft().scale(y);
	  
	  
	  
	var svg = d3.select("#d3exampleContainer").append("svg")
	  .attr("width", svgWidth + svgMargin.left + svgMargin.right)
	  .attr("height", svgHeight + svgMargin.top + svgMargin.bottom + text_legend_height)
	  .append("g")
	  .attr("transform", "translate(" + svgMargin.left + "," + svgMargin.top + ")");
	  
	xScale.domain(data.map(function(d) {
	return d.value;
	}));

	y.domain(d3.extent(data, function(d) {
	return d.occurence;
	}));

	svg.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + svgHeight + ")")
	.call(xAxis);
	
	svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0)
        .attr("x",0 - (svgHeight / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
		.style("color", "white")
        .text("bin percentage (%)");
		

	svg.append("g")
	.attr("class", "y axis")
	.call(yAxis);

	
	svg.append("text")      // text label for the x axis
        .attr("x", svgWidth/2 )
        .attr("y", svgHeight + text_legend_height )
        .style("text-anchor", "middle")
        .text("Bins (Hz)");
	
	svg.selectAll(".bar")
	.data(data)
	.enter().append("rect")
	.attr("class", "bar")
	.attr("x", function(d) { return xScale(d.value); })
	.attr("width", xScale.bandwidth()-bar_margin)
	.attr("y", function(d) { return y(d.occurence); })
	.attr("height", function(d) { return svgHeight - y(d.occurence); });
	
}

function Node(val){
  this.value = val;
  this.left = null;
  this.right = null;
  this.occurence = 0;
  
}


Tree.prototype.addValue = function(val){
  var n = new Node(val);
  if(this.root == null){
    this.root = n;
    this.bins = 1;
    n.occurence = 100/test_iterations;
  }else{
    this.bins += this.root.addNode(n);
  }
}

Tree.prototype.traverse = function(){
  this.root.visit();
}


Node.prototype.visit = function(){
  
  if(this.left != null){
    this.left.visit();
  }
  
  
  data.push({value: this.value, occurence: this.occurence});
  
  if(this.right != null){
    this.right.visit();
  }
  
}

Node.prototype.addNode = function(n){
  if(this.value == n.value){
    this.occurence += 100/test_iterations;
    return 0;
  }else if(n.value < this.value){
    if(this.left == null){
      n.occurence += 100/test_iterations;
      this.left = n;
      return 1;
    }else{
      return this.left.addNode(n);
    }
  }else{
    if(this.right == null){
        n.occurence += 100/test_iterations;
        this.right = n;
        return 1;
    }else{
      return this.right.addNode(n);
    }
  }
}


function Tree(){
  this.root = null;
  this.bins = 0;
}

function d3clickEvent(){
	
	bin_intervals = parseTextField('iter');
	bin_intervals = parseTextField('deltaBins');
	capacitor_value = parseTextField('capVal');
	capacitor_tolerance = parseTextField('capTol');
	inductor_value = parseTextField('lVal');
	inductor_tolerance = parseTextField('lTol');
	
	capacitor_min = capacitor_value*(1-capacitor_tolerance/100);
	capacitor_max = capacitor_value*(1+capacitor_tolerance/100);
	capacitor_range = capacitor_max - capacitor_min;

	inductor_min = inductor_value*(1-inductor_tolerance/100);
	inductor_max = inductor_value*(1+inductor_tolerance/100);
	inductor_range = inductor_max - inductor_min;
	
	
	data = [];
	
	getData();
  
	var svg = d3.select("#d3exampleContainer").select("svg").select("g");
	
	var xScale = d3.scaleBand().range([0, svgWidth]).round(0.1);

	var y = d3.scaleLinear()
	  .range([svgHeight, 0]);
	
	var xAxis = d3.axisBottom().scale(xScale);

	var yAxis = d3.axisLeft().scale(y);
	
	xScale.domain(data.map(function(d) {
	return d.value;
	}));

	y.domain(d3.extent(data, function(d) {
	return d.occurence;
	}));
	
	var bars = svg.selectAll(".bar").data(data);
	bars.transition()
	.attr("x", function(d) { return xScale(d.value); })
	.attr("width", xScale.bandwidth()-bar_margin)
	.attr("y", function(d) { return y(d.occurence); })
	.attr("height", function(d) { return svgHeight - y(d.occurence); });
	
	bars.enter().append("rect")
	.transition()
	.attr("class", "bar")
	.attr("x", function(d) { return xScale(d.value); })
	.attr("width", xScale.bandwidth()-bar_margin)
	.attr("y", function(d) { return y(d.occurence); })
	.attr("height", function(d) { return svgHeight - y(d.occurence); });

	bars.exit().remove();
	
	svg.select(".x.axis") // change the x axis
	.transition()
	.call(xAxis);
	svg.select(".y.axis") // change the y axis
	.transition()
	.call(yAxis);
}

function getData(){
	tree = new Tree();


	for(var i = 0; i<test_iterations; i++){
		tree.addValue(Math.floor(
			(1/(2*Math.PI*Math.sqrt((Math.random()*capacitor_range+capacitor_min)*(Math.random()*inductor_range+inductor_min))))/bin_intervals
		)*bin_intervals);
	}


	tree.traverse();
}

function parseTextField(id){
	if(document.getElementById(id).value == ''){
		document.getElementById(id).classList.add('invalid');
		return null;
	}else{
		document.getElementById(id).classList.remove('invalid');
		return parseFloat(document.getElementById(id).value);
	}
}