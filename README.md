[![Netlify Status](https://api.netlify.com/api/v1/badges/bd37cbc5-a119-40a1-93e9-badcdb818313/deploy-status)](https://app.netlify.com/sites/frontend-data-tomas/deploys)
## Functional data - Weapon datavis

![alt text](https://github.com/TomasS666/frontend-data/blob/master/wiki/images/concept-header.png "heaeder image")

![alt text](https://github.com/TomasS666/frontend-data/blob/master/wiki/images/update-transition-legend-active.gif "úpdate")


[Link to Demo](https://frontend-data-tomas.netlify.com/)

## Description
Data visualation for the NMVW with an additional layer of interactivity and cleanup pattern for the NMVW API data.

## Concept
See a complete view on weapons and weaponparts their functions on a worldwide scale. The locations represent the geographical location of heritage.

## Target group
The data visualisation can be both usefull for the NMVW itself as for visitors. For the NMWV it has potential for quick insides in the location of heritage of all objects. Where only weapons are used now, it's easily expandable.

## Installation steps
You can clone this repository by using the command ``` git clone https://github.com/TomasS666/frontend-data.git ``` in your CLI.
Or you can just push the green button right on the top of this page and download the repo as a zip file.

## New features
- When zooming the objects scale accordingly.
- On hover you see the title of an object
- Highlighting legend items
- Filtering by functional category
- Sidebar wich displays information on the clicked object

## Features
- Datavisualisation in d3
- Functional data fetch and transform pattern
- Cleaning pattern for language column student survey data

## Known bugs
- When you change the filter while you're zoomed in, the zooming factor on the circles isn't triggered. Because the factor applies only when the zoom event is triggered right now.
- The zoom factor is fine-tuned but still doesn't entirely give a pleasing result. It's good enough, but can be improved.

## Demo Datavis
[Find it here](https://frontend-data-tomas.netlify.com/)

## Variabelen
Ik haal met de bovenstaande query objecten op met de volgende properties:

**title : is the title of the objectt**

**typeLabel: is de functie van het wapen, bijv. ceremonieel.**

**Lat en long: coördinaten (niet DMS format)**

**choCount : het aantal van het object (eigenlijk niet nodig)**

**plaats: deeplink naar plaats**

## Data I'm fetching
```sparql

PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dct: <http://purl.org/dc/terms/>
PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
PREFIX edm: <http://www.europeana.eu/schemas/edm/>
PREFIX foaf: <http://xmlns.com/foaf/0.1/>
PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
PREFIX gn: <http://www.geonames.org/ontology#>

# tel de materiaalsoorten bij wapens
SELECT ?title ?typeLabel ?long ?lat ?plaats (SAMPLE(?cho) as ?filtered)  (COUNT(?cho) AS ?choCount) WHERE {
  # selecteer soorten wapens
  <https://hdl.handle.net/20.500.11840/termmaster12445> skos:narrower ?type .
  ?type skos:prefLabel ?typeLabel .

  # geef objecten van een soort wapen
  ?cho dc:title ?title.
  ?cho edm:object ?type .
	
  
  ?plaats skos:exactMatch/wgs84:lat ?lat . #
  ?plaats skos:exactMatch/wgs84:long ?long .


}

LIMIT 10000`;
```

## .gitignore
```
node_modules
dist

```
The following files are ignored when I commit.

## Credits
Ivo, for all the support from week 1 and on, learning me and others about LOD and SPARQL.

Eyob for helping me out with bundlers.

Laurens for the examples, again for the legend he used in d3, de runquery function which I used as a foundation of my further iterations and the way you can clean up objects.

Ramon for all the feedback on my wiki, the mental support, de bug fixes which we went through together and the remaining time of which we pulled each other through.

The tooltips: (https://www.npmjs.com/package/d3-tip)[https://www.npmjs.com/package/d3-tip]

For plotting circles on the map and how Curran created the map itself: [link](http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6)

[Curran Kelleher](https://www.youtube.com/channel/UCSwd_9jyX4YtDYm9p9MxQqw) for all the tutorials and a general better understanding about d3.


Nick for the remaing piece of the puzzle of .exit().remove().

## License
[Copyright (c) 2019 Tomas S](https://github.com/TomasS666/frontend-data/blob/master/LICENSE)
