// Internal modules
import {
  capatalize
} from './helpers/textTransformation';
import {
  getData
} from './helpers/fetchData.js';
import {
  query
} from './helpers/query.js';


// External modules 
import {
  select,
  json,
  tsv,
  geoPath,
  zoom,
  event,
} from "d3";

import * as d3 from "d3";

import d3Tip from "d3-tip";
d3.tip = d3Tip;

import { geoFahey } from 'd3-geo-projection';

import {
  feature
} from 'topojson';

// Creating a tooltip for every circle on the map
// Reference https://www.npmjs.com/package/d3-tip
const weaponTip = d3.tip().attr('class', 'd3-tip').html(function (d) {
  return d.title;
});

const svgWidth = window.innerWidth;
const svgHeight = window.innerHeight;

const svg = select('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)

  .call(weaponTip);

// Two lines from example Curran Kelleher: https://www.youtube.com/watch?v=Qw6uAg3EO64&t=42s
const projection = geoFahey();
const pathGenerator = geoPath().projection(projection);

const g = svg.append('g');
const legendLineheight = 18;

const url = "https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-38/sparql";


// Own function to get data, the helper function to create the query is based on Laurens his runquery example

getData(url, query).then(data => {
  console.log(data)

  initD3(data)

  return data;
})

// Own init function, purely to pass the data when it's fetched and transformed

function initD3(places) {

  // categories
  const cats = places.map((entry) => {
    return entry.weaponFunction;
  });


  // Learned this together with Ramon. Thanks to him I got a better understanding on scaleOrdinal schemecategory
  const colorscale = d3.scaleOrdinal()
    .domain(cats)
    .range(d3.schemeCategory10);

  // from example Curran Kelleher: https://www.youtube.com/watch?v=Qw6uAg3EO64&t=42s
  g.append('path')
    .attr('class', 'sphere')
    .attr('d', pathGenerator({
      type: 'Sphere'
    }));

  /* from example Curran Kelleher: https://www.youtube.com/watch?v=Qw6uAg3EO64&t=42s
     Big credits to Lennart. Thanks to him I can put a limit on zooming and on zoom, 
     the circles will scale according to a factor I couldn't figure out. 
  */
  svg.call(zoom().scaleExtent([1, 40]).on('zoom', () => {

    g.attr('transform', event.transform);
    let zoomLevel = d3.event.transform.k;
    g.selectAll('circle').attr('r', (43 - zoomLevel) / 30);

  }));

  // Looked at the nest function and how Laurens uses the nest function.
  const weaponGroups = d3.nest()
    .key(function (d) {
      return d.weaponFunction;
    })
    .entries(places);

  // More of my own stuff
  function createSidebar() {
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


    // I append a title, yet leave it empty till it's updated by clicking on a circle
    const title = sidebarContent.append('text')
      .attr('id', 'title')
      .text();
    

    const herkomstLand = sidebarContent.append('text')
      .attr('id', 'heritage-country')
      .text('Land van geografische herkomst:')
      .style('transform', `translateY(${(sidebarHeight / 4) * 1.5}px)`);

    const herkomstPlace = sidebarContent.append('text')
      .attr('id', 'heritage-place')
      .text('Plaats van geografische herkomst:')
      .style('transform', `translateY(${(sidebarHeight / 3) * 1.5}px)`);

    const img = sidebarContent.append('image')
      .attr('class', 'img');
  }



  function selectData(category) {

    // Wrote this myself.
    const newArray = weaponGroups.filter(item => {
      return item.key == category
    }).reduce(item => item)

    console.log(newArray)
    drawCircles(newArray.values)

    return;

  }


  function createLegend() {
    // Wrote this myself
    const legendWrapper = svg.append('g')
      .attr("class", "legend");


    legendWrapper
      .append("rect")
      .attr("x", 5)
      .attr("class", "legend-wrapper");
    // .on('click', console.log('f'));
    let clickCount = 0;
    const legendContainer = legendWrapper.append('g')
      .attr('class', 'legend-container')
      .attr('data-legend', 'container')
      .on('click', function () {

        // console.log(event.target)\

        /* Event delegation (a little ugly, yet better than multiple eventlisteners)

          Works pretty much the same way as a normal eventlistener (event), exept that the 
          event object is available already within the eventlistener.

          If the parent of all legend items it's data-legend value equals container,
          I know I'm in the right place. Itemparent is the legend item it's parent group which holds
          the text and the rect. That group contains the category and I can put an active class on it.

        */
        const upperParent = event.target.parentNode.parentNode.dataset.legend;


        if (upperParent === 'container') {
          const itemParent = event.target.parentNode;

          legendContainer.selectAll('.legend-item')
            .classed('active', false)
            .attr('class', 'legend-item');

          // if(clickCount % 2 === 0){
          //   console.log('fefefef')
          itemParent.classList.add('active');
          //   clickCount++;
          // }else{
          //   clickCount = 0;
          //   console.log('yeaa?')
          //   itemParent.classList.remove('active');  
          // }

          // Call function and give category name of the legend-item group as argument
          selectData(itemParent.dataset.category)
        }


      })

    const legend = legendContainer.selectAll(".legend")
      .data(colorscale.domain())
      .enter()
      .append("g")
      .attr("class", "legend-item")
      .attr('data-category', d => d)
      .attr("transform", function (d, i) {
        return "translate(0," + i * 35 + ")";
      })
      .on('click', function () {
        // selectData(d3.event.target.parentNode.dataset.category)
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
        return capatalize(d);
      })

    legendWrapper
      .style("transform", "translate(-200px, 203px)");
    legendWrapper
      .transition().duration(2000)
      .style("transform", "translate(10px, 203px)");

  }

  // from example Curran Kelleher: https://www.youtube.com/watch?v=Qw6uAg3EO64&t=42s

  Promise.all([
    tsv('https://unpkg.com/world-atlas@1.1.4/world/50m.tsv'),
    json('https://unpkg.com/world-atlas@1.1.4/world/50m.json')
  ]).then(([tsvData, topoJSONdata]) => {

    
    drawMap(tsvData, topoJSONdata)

    // drawCircles(weaponGroups[0].values)
    
// Call my own functions
    createSidebar()
    createLegend()

  });

// from example Curran Kelleher: https://www.youtube.com/watch?v=Qw6uAg3EO64&t=42s
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

  // Based on example Curran Kelleher: https://www.youtube.com/watch?v=Qw6uAg3EO64&t=42s
  // But added the update pattern, added the tooltip on hover, added the sidebar content update.
  // Added usefull transition
  function drawCircles(data) {

    const circles = g.selectAll('circle');

    circles.data(data)

      // Update
      
      .transition()
        .delay((d, i)=>{
          return i * 1;
        })
        .duration(700)
        .ease(d3.easeQuadOut)
        .attr("transform", function (d) {


          return "translate(" + projection([
            d.long,
            d.lat
          ]) + ")";
        })
        .style('fill', function (d) {

          return colorscale(d.weaponFunction)
        })
      .attr("r", 1);
      
      
      circles
      .on('mouseenter', weaponTip.show)
      .on('mouseleave', weaponTip.hide)
      .on('click', function (d) {

        // console.log(d3.select(this.parentNode))
        d3.select('.sidebar-wrapper')
          .select('text')
          .data(places)
          .text(d.title);

        d3.select('#heritage-place')
          .text(function () {
            return `Land van geografische herkomst: ${ d.plaatsnaam }`;
          });

        d3.select('#content').select('.img')
          .attr('xlink:href', d.picturePath)


        console.log(d.title);


      });



    // If more circles are needed 
    circles.data(data).enter()
      .append("circle")

      .on('mouseenter', weaponTip.show)
      .on('mouseleave', weaponTip.hide)
      .on('click', function (d) {

        // console.log(d3.select(this.parentNode))
        d3.select('.sidebar-wrapper')
          .select('text')
          .data(places)
          .text(d.title);

        d3.select('#heritage-country')
          .text(function () {
            return `Land van geografische herkomst: ${ d.land }`;
          });

        d3.select('#heritage-place')
        .text(function () {
          return `Plaats van geografische herkomst: ${ d.plaatsnaam }`;
        })

        d3.select('#content').select('.img')
          .attr('xlink:href', d.picturePath)


        console.log(d.title);


      })
      
      .attr("transform", function (d) {
        return "translate(" + projection([
          d.long,
          d.lat
        ]) + ")";
      })
      .style('fill', function (d) {
        return colorscale(d.weaponFunction)
      })
      .transition()
        .delay((d, i)=>{
          return i * 1;
        })
        .duration(700)
        .ease(d3.easeQuadOut)
        .attr("r", 1);

      

    console.log(g.selectAll('circle'))


    circles.data(data).exit()
      .remove()

  }

}