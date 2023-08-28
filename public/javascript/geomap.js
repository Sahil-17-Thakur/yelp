mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
container: 'show-map', // container ID
style: 'mapbox://styles/mapbox/light-v10', // style URL
center: camp.geometry.coordinates,// starting position [lng, lat]
zoom: 8, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());

new mapboxgl.Marker()
.setLngLat(camp.geometry.coordinates)
.setPopup(
    new mapboxgl.Popup({offset: 25})
    .setHTML(
        `<h2>${camp.title}</h2><p>${camp.location}</p>`
    )
)
.addTo(map)