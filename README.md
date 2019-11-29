[![Netlify Status](https://api.netlify.com/api/v1/badges/bd37cbc5-a119-40a1-93e9-badcdb818313/deploy-status)](https://app.netlify.com/sites/frontend-data-tomas/deploys)
## Functional data - Weapon datavis

![alt text](https://github.com/TomasS666/frontend-data/blob/master/wiki/images/concept-header.png "heaeder image")

[Link to Demo](https://frontend-data-tomas.netlify.com/)

## Description
Data visualation for the NMVW with an additional layer of interactivity and cleanup pattern for the NMVW API data.

## Concept
See a complete view on weapons and weaponparts their functions on a worldwide scale. The locations represent the location of heritage or the location where the object was found.

## Installation steps
You can clone this repository by using the command ``` git clone https://github.com/TomasS666/frontend-data.git ``` in your CLI.
Or you can just push the green button right on the top of this page and download the repo as a zip file.

## New features
- Sidebar wich displays information on the clicked object
- Tooltips on hover

## Features in progress
- When the user zooms, the scattered circles need to reflect the change of scale.
- On click parent country in sidebar, country gets centered or more detail.

## New features
- When zooming the objects scale accordingly.
- On hover you see the title of an object
- Highlighting legend items
- Filtering by functional category
- Weapon detail window

## Features
- Datavisualisation in d3
- Functional data fetch and transform pattern
- Cleaning pattern for language column student survey data

## Future 

## Demo Datavis
[Find it here](https://frontend-data-tomas.netlify.com/)

## Variabelen
Ik haal met de bovenstaande query objecten op met de volgende properties:

**title : is vanzelfsprekend de titel van het object**

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

## Credits
Ivo, voor alle support vanaf week 1 met het leren over LOD en SPARQL.
Eyob voor het helpen met het bundelen van files d.m.v.
Laurens voor de voorbeelden, nogmaals voor de legend in d3, de runquery die ik als basis heb gebruikt en de manier waarop je objecten kunt opschonen.
Ramon voor alle feedback op mijn wiki en alle mentale support en de bug fixes.

Voor het plotten van cirlces op de map: [link](http://bl.ocks.org/lokesh005/7640d9b562bf59b561d6)

[Curran Kelleher](https://www.youtube.com/channel/UCSwd_9jyX4YtDYm9p9MxQqw) voor alle tutorials en een beter begrip van D3 door het wat luchtiger te maken.



Nick voor het laatste puzzelstukje van exit().remove().
