import { getData } from './helpers/fetchData.js';
import { query } from './helpers/query.js';

import { select, json, tsv, geoPath, geoMercator, zoom, event, scale } from "d3";

import * as d3 from "d3"; 

import d3Tip from "d3-tip";
d3.tip = d3Tip;



import { feature } from 'topojson';
const weaponTip = d3.tip().attr('class', 'd3-tip').html(function(d) { return d.title.value; });

const svg = select('svg')
      .attr('width', window.innerWidth)
      .attr('height', window.innerHeight)
			.call(weaponTip);
const projection = geoMercator(); 
const pathGenerator = geoPath().projection(projection);
const g = svg.append('g');
const legendLineheight = 18;



const url ="https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-38/sparql";



getData(url, query).then(data => {
  // console.log(data.results.bindings)
  initD3(data.results.bindings)
  // console.log(data)
	return data;
}) 



function initD3(places){

  
const cats = places.map((entry) => {
  return entry.typeLabel.value;
});

                      // console.log(d3)

  
const colorscale = d3.scaleOrdinal()
  .domain(cats)
  .range(d3.schemeCategory10);

g.append('path')
  .attr('class', 'sphere')
  .attr('d', pathGenerator({type: 'Sphere'}));


  

	
svg.call(zoom().scaleExtent([0.5, 5]).on('zoom', () => {
  var transform = event.transform;
    // console.log(transform)
    // console.log(event.target)
  	// console.log(Math.round(event.transform.k))
    g.attr('transform', event.transform);
    // g.selectAll('circle')
    //   .attr('transform', event.transform)
}));
 

const sidebarWrapper = svg.append('g')
  .attr("class", "sidebar-wrapper");

  const sidebar = svg.append('rect')
    .style('width', 400)
    .style('height', window.innerHeight)
    .style('background-color', 'black')
    .style('transform', `translateX(${innerWidth - 400}px`);

  
  const legendWrapper = svg.append('g')
  	.attr("class", "legend-group");
  
  legendWrapper.append("rect")
        .attr("x", 5)
				.attr("class", "legend-wrapper");

  
  const legend = legendWrapper.selectAll(".legend")
        .data(colorscale.domain())
        .enter()
  			.append("g")
        .attr("class", "legend")
        .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; })


        legend.append("rect")
        .attr("x", 185 - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", colorscale);

        legend.append("text")
        .attr("x", 185 - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
  			.attr("class", "legend-text")

        .text(function(d) { return d; });
  
  legendWrapper
  .style("transform", "translate(-200px, 203px)");
  legendWrapper
  	.transition().duration(2000)
  		.style("transform", "translate(10px, 203px)");


Promise.all([
  tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
  json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
]).then(([tsvData, topoJSONdata]) => {
  		const countryName = tsvData.reduce((accumulator, row) => {
        
  			accumulator[row.iso_n3] = row.name;

      		return accumulator;
      }, {});
  

  
			const country = feature(topoJSONdata, topoJSONdata.objects.countries);
        g.selectAll('path')
          .data(country.features)
          .enter()
          .append('path')
          .attr('class', 'country')
          .attr('d', d => pathGenerator(d))
        // .append('title')
        // 	.text(d => countryName[d.id]);
  
  	g.selectAll('circle')
  		.data(places)
          .enter()
      .append('g')
  			.attr('id', d => d.title.value)
      .append("circle")
          .attr("r", 1)
          .attr("transform", function(d) {


          return "translate(" + projection([
            d.long.value,
            d.lat.value
          ]) + ")";
          })
        .style('fill', function(d){

          return colorscale(d.typeLabel.value)
        })
  			.on('mouseenter', weaponTip.show)
  			.on('mouseleave', weaponTip.hide)
  			.on('click', function (d) {
          
      // console.log(d3.select(this.parentNode))
      d3.select(this.parentNode)
        .append('img')
      	.attr('src', d.picturePath.value)

      	.attr('class', 'object-image')
      	
      
        .attr("transform", function(d) {
            console.log(d)

            return "translate(" + projection([
              d.long.value,
              d.lat.value
            ]) + ")";
        })
      
      
      
        })
  				
  		
  					
});

}
