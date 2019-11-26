import {
  getData
} from './helpers/fetchData.js';
import {
  query
} from './helpers/query.js';

import {
  select,
  json,
  tsv,
  geoPath,
  geoMercator,
  zoom,
  event,
  scale
} from "d3";

import * as d3 from "d3";

import d3Tip from "d3-tip";
d3.tip = d3Tip;



import {
  feature
} from 'topojson';
const weaponTip = d3.tip().attr('class', 'd3-tip').html(function (d) {
  return d.title;
});

const svgWidth = window.innerWidth;
const svgHeight = window.innerHeight;

const svg = select('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)

  .call(weaponTip);
const projection = geoMercator();
const pathGenerator = geoPath().projection(projection);
const g = svg.append('g');
const legendLineheight = 18;



const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-38/sparql";



getData(url, query).then(data => {
  // console.log(data.results.bindings)
  // initD3(data)

  // console.log(data)

  

 

  
  initD3(data)

  // createDropdown(weaponGroups);



  return data;
})

function createDropdown(data){
  const dropdown = d3.select('select');
  
  // const testArray = data.map(obj => obj.key)

  // testArray

  dropdown.selectAll('option')
  .data(data)
  .enter()
  .append('option')
  .attr('value', d => d.key)
    .text(d => d.key)
}





function initD3(places) {


  const cats = places.map((entry) => {
    return entry.weaponFunction;
  });

  // console.log(d3)


  const colorscale = d3.scaleOrdinal()
    .domain(cats)
    .range(d3.schemeCategory10);

  g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({
      type: 'Sphere'
    }));





  svg.call(zoom().scaleExtent([0.5, 40]).on('zoom', () => {
    var transform = event.transform;

    g.attr('transform', event.transform);
    let zoomLevel = d3.event.transform.k;
    g.selectAll('circle').attr('r', (43 - zoomLevel) / 30);

    // console.log((16 - zoomLevel) / 16)

  }));

  const weaponGroups = d3.nest()
  .key(function(d) { return d.weaponFunction; })
  .entries(places);


function createSidebar(){
  const sidebarWrapper = svg.append('g')
    .attr("class", "sidebar-wrapper")
    .style('transform', `translateX(${innerWidth - 400}px`)
    .attr('height', window.innerHeight)
    .attr('width', 400);

  const sidebarWidth = sidebarWrapper.attr('width');
  const sidebarHeight = sidebarWrapper.attr('height');

  const sidebar = sidebarWrapper.append('rect')
    .attr('class', 'sidebar')
    .attr('height', sidebarHeight)
    .attr('width', sidebarWidth);

  const sidebarContent = sidebarWrapper.append('g')
    .attr('id', 'content')
    .style('transform', `translate(${30}px, ${40}px`)
    .attr('height', sidebarHeight - 20)
    .attr('width', sidebarWidth - 20);

  const title = sidebarContent.append('text')
    .attr('id', 'title')
    .text();

  const herkomst = sidebarContent.append('text')
    .attr('id', 'heritage')
    .text('Plaats van geografische herkomst:')
    .style('transform', `translateY(${(sidebarHeight / 3) * 1.5}px)`);

  const img = sidebarContent.append('image')
    .attr('class', 'img');
}



    function selectData(category){

      const newArray = weaponGroups.filter(item => item.key == category);
      console.log(newArray[0].values)
      drawCircles(newArray[0].values)

      return;
    
    }

    // function updateCircles

   function createLegend(){

    const legendWrapper = svg.append('g')
    .attr("class", "legend-group");
    // .on('click', console.log(event.target))

  legendWrapper.append("rect")
    .attr("x", 5)
    .attr("class", "legend-wrapper");


  const legend = legendWrapper.selectAll(".legend")
    .data(colorscale.domain())
    .enter()
    .append("g")
    .attr("class", "legend")
    .attr('data-category', d => d)
    .attr("transform", function (d, i) {
      return "translate(0," + i * 20 + ")";
    })
    .on('click', function(){ 
      selectData(d3.event.target.parentNode.dataset.category)
      // console.log(d)
    })

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

    .text(function (d) {
      return d;
    })

  legendWrapper
    .style("transform", "translate(-200px, 203px)");
  legendWrapper
    .transition().duration(2000)
    .style("transform", "translate(10px, 203px)");

  }
  Promise.all([
    tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
    json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
  ]).then(([tsvData, topoJSONdata]) => {

    drawMap(tsvData, topoJSONdata)
    drawCircles(weaponGroups[5].values)

    createSidebar()
    createLegend();

  });


  function drawMap(tsvData, topoJSONdata) {
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





  }

  function drawCircles(data){
    
    g.selectAll('circle')
    .exit().remove()
      .data( data )
  
      .enter()
      .append('g')
      .attr('id', d => d.title)
      .append("circle")
      .attr("r", 1)
      .attr("transform", function (d) {


        return "translate(" + projection([
          d.long,
          d.lat
        ]) + ")";
      })
      .style('fill', function (d) {

        return colorscale(d.weaponFunction)
      })
      .on('mouseenter', weaponTip.show)
      .on('mouseleave', weaponTip.hide)
      .on('click', function (d) {

        // console.log(d3.select(this.parentNode))
        d3.select('.sidebar-wrapper')
          .select('text')
          .data(places)
          .text(d.title);

        d3.select('#heritage')
          .text(function () {
            return `Plaats van geografische herkomst: ${ d.land }`;
          })

        d3.select('#content').select('.img')
          .attr('xlink:href', d.picturePath)


        console.log(d.title);


      })
      
  }

}