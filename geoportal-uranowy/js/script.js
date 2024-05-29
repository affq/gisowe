var map = L.map('map').setView([52.058654, 19.633047], 6);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Państwowy Instytut Geologiczny'
}).addTo(map);

var uranLayer = L.Geoserver.wms('http://localhost:8080/geoserver/wms', {
    layers: "uran:uran"
})

uranLayer.addTo(map);

var citiesLayer = L.Geoserver.wfs('http://localhost:8080/geoserver/wfs', {
    layers: "miasta:miasta"
})

citiesLayer.addTo(map);

var legend = L.control({position: 'topright'});
legend.onAdd = function (map) {
    div = L.DomUtil.get('legend');
    div.innerHTML = '<h3>Zawartość uranu (eU) [g/t] </h3><img src="http://localhost:8080/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&LAYER=uran:uran&style=style&TRANSPARENT=true" alt="legend">';
    return div;
};

legend.addTo(map);

function parseFeatureInfo(data) {
    return data;
}

map.on('click', function(e) {
    var url = getFeatureInfoUrl(e.latlng);

    fetch(url)
        .then(response => response.text())
        .then(data => {
            var content = parseFeatureInfo(data);
            L.popup()
                .setLatLng(e.latlng)
                .setContent(content)
                .openOn(map);
        })
        .catch(error => {
            console.error('Error fetching GetFeatureInfo:', error);
        });
});

function getFeatureInfoUrl(latlng) {
    var point = map.latLngToContainerPoint(latlng, map.getZoom());
    var size = map.getSize();

    var params = {
        request: 'GetFeatureInfo',
        service: 'WMS',
        srs: 'EPSG:4326',
        styles: '',
        transparent: true,
        version: '1.1.1',
        format: 'image/png',
        bbox: map.getBounds().toBBoxString(),
        height: size.y,
        width: size.x,
        layers: 'uran:uran',
        query_layers: 'uran:uran',
        info_format: 'text/html',
        x: Math.floor(point.x),
        y: Math.floor(point.y)
    };

    return 'http://localhost:8080/geoserver/wms' + L.Util.getParamString(params, 'http://localhost:8080/geoserver/wms', true);
}

