// Creating map object
var myMap = L.map("map", {
  center: [37.773972, --122.431297],
  zoom: 4
});

// Adding tile layer to the map
L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.streets",
  accessToken: API_KEY
}).addTo(myMap);

var geojson = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Grab the data with d3
d3.json(geojson, function(response) {

  // make cluster group
  var markers = L.markerClusterGroup();

  for (var i = 0; i < response.features.length; i++) {

    var location = response.features[i].geometry;
    var magnitude = response.features[i].properties.mag;
    var place = response.features[i].properties.place;
    // color
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

    // add to map
    L.circle([location.coordinates[1], location.coordinates[0]], {
      fillOpacity: 0.75,
      color: "white",
      weight: 0,
      fillColor: color,
      // Adjust radius
      radius: magnitude * 13000
    }).bindPopup("<h1> Magnitude " + magnitude + "</h1> <hr> <h3> " + place + "</h3>").addTo(myMap);
  }

    // get location properties
    if (location) {

      // add to group and bind to map
      markers.addLayer(L.marker([location.coordinates[1], location.coordinates[0]])
        .bindPopup(magnitude));
    }

  // add cluster layer to map
  myMap.addLayer(markers);

  // legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function() {
    var div = L.DomUtil.create("div", "info legend");
    var limits = geojson.options.limits;
    var colors = geojson.options.colors;
    var labels = [];

    //
    var legendInfo = "<h1>Earthquakes</h1>" +
      "<div class=\"labels\">" +
        "<div class=\"min\">" + limits[0] + "</div>" +
        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;
    limits.forEach(function(limit, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });
    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };
  legend.addTo(myMap);
});
