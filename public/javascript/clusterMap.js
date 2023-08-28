mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'map',
// Choose from Mapbox's core styles, or make your own style with Mapbox Studio
style: 'mapbox://styles/mapbox/light-v10',
center: [-103.5917, 40.6699],
zoom: 3
});
 
map.addControl(new mapboxgl.NavigationControl());

map.on('load', () => {

map.addSource('campLists', {
type: 'geojson',

data: campLists,
cluster: true,
clusterMaxZoom: 14, 
clusterRadius: 50 
});
 
map.addLayer({
id: 'clusters',
type: 'circle',
source: 'campLists',
filter: ['has', 'point_count'],
paint: {

'circle-color': [
'step',
['get', 'point_count'],
'#18FFFF',
10,
'#536DFE',
30,
'#E040FB'
],
'circle-radius': [
'step',
['get', 'point_count'],
15,
10,
25,
30,
30
]
}
});
 
map.addLayer({
id: 'cluster-count',
type: 'symbol',
source: 'campLists',
filter: ['has', 'point_count'],
layout: {
'text-field': ['get', 'point_count_abbreviated'],
'text-font': ['DIN Offc Pro Medium', 'Arial Unicode MS Bold'],
'text-size': 12
}
});
 
map.addLayer({
id: 'unclustered-point',
type: 'circle',
source: 'campLists',
filter: ['!', ['has', 'point_count']],
paint: {
'circle-color': '#11b4da',
'circle-radius': 4,
'circle-stroke-width': 1,
'circle-stroke-color': '#fff'
}
});
 
map.on('click', 'clusters', (e) => {
const features = map.queryRenderedFeatures(e.point, {
layers: ['clusters']
});
const clusterId = features[0].properties.cluster_id;
map.getSource('campLists').getClusterExpansionZoom(
clusterId,
(err, zoom) => {
if (err) return;
 
map.easeTo({
center: features[0].geometry.coordinates,
zoom: zoom
});
}
);
});
 
map.on('click', 'unclustered-point', (e) => {
const {popUpMarkup} = e.features[0].properties;
const coordinates = e.features[0].geometry.coordinates.slice()
 

while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
}
 
new mapboxgl.Popup()
.setLngLat(coordinates)
.setHTML(popUpMarkup)
.addTo(map);
});
 
map.on('mouseenter', 'clusters', () => {
map.getCanvas().style.cursor = 'pointer';
});
map.on('mouseleave', 'clusters', () => {
map.getCanvas().style.cursor = '';
});
});