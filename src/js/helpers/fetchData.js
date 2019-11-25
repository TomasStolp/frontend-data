import { type } from "os";

async function getData(url, query){
    const newQuery = createQuery(url, query);
    const fetch = await fetchData(newQuery, 'json');
    const data = await dataResponse(fetch, toJSON);
    console.log(data)
    const clean = cleanObjects(data.results.bindings);
    
    return clean;
}

function createQuery( url, query ){
    return url+"?query="+ encodeURIComponent(query); 
}

/* 
    Format is json by default if the developer ommits the format argument
*/

function fetchData( query, format ){
    // Format is JSON by default unless otherwise stated
    return format ? fetch(`${ query }&format=${ format }`) : fetch(`${ query }`);
}

// Data response

async function dataResponse( fetch, fn ){

    // Await the given fetch promise 
    let response = await fetch;
    
    // if callback function is given use it, call it, else just return the response
    return ( fn ? fn(response) : response );
}

// Data parsing / converting

async function toJSON( response ){
    let jsonData = await response;
    let res = await jsonData.json();

    return res;
}

function cleanObjects(array){
    return array.map(obj => {
        return{
            title: obj.title.value,
            plaats: obj.plaats.value,
            plaatsnaam: obj.plaatsnaam.value,
            land: obj.landNaam.value,
            picturePath: obj.picturePath.value,
            weaponFunction: obj.typeLabel.value,
            lat: obj.lat.value,
            long: obj.long.value
        } 
    })
}

export { getData }



