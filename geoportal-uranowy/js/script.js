var map = L.map('map').setView([52.058654, 19.633047], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: ''
}).addTo(map);

var uranLayer = L.Geoserver.wms('http://localhost:8080/geoserver/wms', {
    layers: "uran:uran"
})

uranLayer.addTo(map);

// var citiesLayer = L.Geoserver.wfs('http://localhost:8080/geoserver/wfs', {
//     layers: "miasta:miasta"
// })

// citiesLayer.addTo(map);


var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
    div = L.DomUtil.get('legend');
    div.innerHTML = '<h3>Zawartość uranu (eU) [g/t] </h3><img src="http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=uran:uran&style=style&TRANSPARENT=true" alt="legend">';
    return div;
};

legend.addTo(map);
