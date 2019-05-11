// map object
var myMap = L.map("map", {
  center: [40, -95],
  zoom: 4,
  maxBounds: [[-90, -180], [90, 180]]
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.dark",
  accessToken: API_KEY
}).addTo(myMap);

// Store API query variable
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Grab the data with d3
d3.json(url, function(response) {

  console.log(url)

  // Create a new marker cluster group
  var markers = L.markerClusterGroup();

  //Loop through data
  for (var i = 0; i < response.features.length; i++) {

    var location = response.features[i].geometry;
    var magnitude = response.features[i].properties.mag;
    var place = response.features[i].properties.place;

    // select color for marker
    var color = "";
    if (magnitude < 1) {
      color = "green";
    }
    else if (magnitude < 2) {
      color = "yellow";
    }
    else if (magnitude < 3) {
      color = "orange";
    }
    else {
      color = "red";
    }

    // place circles
    L.circle([location.coordinates[1], location.coordinates[0]], {
      fillOpacity: 0.75,
      color: "white",
      weight: 0,
      fillColor: color,
      radius: magnitude * 10000
    }).bindPopup("<h1> Magnitude " + magnitude + "</h1> <hr> <h3> " + place + "</h3>").addTo(myMap);
  }
    console.log(magnitude)

    // find location property
    if (location) {

      // add marker to layer and bind
      markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
        .bindPopup(magnitude));
    }

  // add cluster to map
  myMap.addLayer(markers);
});
