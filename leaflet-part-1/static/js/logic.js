// Store API endpoint as queryUrl
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"


// Create map object
let myMap = L.map ("map",{
    center: [37.09, -95.71],
    zoom: 1
});

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap)

// Perform a GET request to the query URL
d3.json(queryUrl).then(function(data){
    function mapStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: mapColor(feature.geometry.coordinates[2]),
            color: "black",
            radius: mapRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // Colors for depth
    function mapColor(depth) {
        switch(true) {
            case depth > 90:
                return "red";
            case depth > 70:
                return "orangered";
            case depth > 50:
                return "orange";
            case depth > 30:
                return "gold";
            case depth >10:
                return "yellow";
            default:
                return "lightgreen";
        }
    }

    // Magnitutde size
    function mapRadius(mag) {
        if (mag === 0) {
            return 1;
        }
        return mag *4;
    }

    // Give each feature a popup that desscribes the place, time, mag of earthquake
    L.geoJSON(data, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng);
        },
        style: mapStyle,
   

        onEachFeature(feature, layer) {
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><p>${new Date(feature.properties.time)}</p>
            <hr><p>${feature.properties.mag}<p>`);
        }
    }).addTo(myMap)

var legend = L.control({position: "bottomright"});
legend.onAdd = function() {
    var div = L.DomUtil.create("div","info legend"),
    depth = [-10, 10, 30, 50, 70, 90];

    for (var i = 0; i<depth.length; i++){
        div.innerHTML +=
        '<i style="background:' + mapColor(depth[i]+1) + '"></i> ' + depth[i] + (depth[i+1] ? '&ndash;' + depth[i+1] +'<br>': '+');
    }
    return div;
    };
legend.addTo(myMap)
})
