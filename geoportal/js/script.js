var mape = L.map('map', {maxZoom:18}).setView([52.191682, 21.028118], 13);

var OpenStreetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
OpenStreetMap.addTo(mape);
var googleSat = L.tileLayer('https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}');
var googleHyb = L.tileLayer('https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}');
var googleTer = L.tileLayer('https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}');

var baseMaps = {
    "OpenStreetMap": OpenStreetMap,
    "Google Satelite": googleSat,
    "Google Hybrid": googleHyb,
    "Google Terrain": googleTer
};


mape.attributionControl.addAttribution('by Ad F');
L.control.scale().addTo(mape);
L.control.locate({
    position: "topleft",
    flyTo: "true",
    keepCurrentZoomLevel: "true",
    initialZoomLevel: "16"
})
.addTo(mape);

let embassies;
let embassiesCluster = L.markerClusterGroup();
fetch('ambasady.geojson')
    .then(response => response.json())
    .then(data => {
        embassies = L.geoJSON(data, {
            pointToLayer: function (feature, latlng) {
                if (feature.properties && feature.properties.flag) {
                    return L.marker(latlng, {
                        icon: L.icon({
                            iconUrl: feature.properties.flag,
                            iconSize: [32, 20],
                            iconAnchor: [16, 16],
                            popupAnchor: [0, -16]
                        })
                    });
                } else {
                    return L.marker(latlng);
                }
            },
            onEachFeature: function (feature, layer) {
                if (feature.properties) {
                    var popupContent = "";
                    var header = "<h3>" + feature.properties.name + "</h3>";
                    var address = "<p>" + feature.properties.address + "</p>";
                    var phone = "<p> <b>tel.:  </b>" + feature.properties.telefon + "</p>";
                    var mail = "<p> <b>email:  </b>" + feature.properties.email + "</p>";
                    var www = "<p> <b>www:  </b> <a href = " + feature.properties.website + ">" + feature.properties.website + "</a></p>";
                    popupContent += header + address + phone + mail + www;
                    layer.bindPopup(popupContent);
                }
            }
        });

        embassiesCluster.addLayer(embassies);
        mape.addLayer(embassiesCluster);

        var overlays = {
            "Ambasady (cluster)": embassiesCluster,
            "Ambasady (bez cluster)": embassies

        };

        L.control.layers(baseMaps, overlays).addTo(mape);

    });




