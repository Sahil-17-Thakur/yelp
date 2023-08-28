document.addEventListener("DOMContentLoaded", function() {
    // Initialize Mapbox with your access token and set up the map container
    mapboxgl.accessToken = mapToken;
    const map = new mapboxgl.Map({
      container: 'add-map',
      style: 'mapbox://styles/mapbox/streets-v11', // Replace with your preferred map style
      center: [-103.5917, 40.6699], // Initial center of the map (e.g., [longitude, latitude])
      zoom: 12 // Initial zoom level
    });

    map.addControl(new mapboxgl.NavigationControl());

    let geocoder = new MapboxGeocoder({
        accessToken: mapboxgl.accessToken,
        mapboxgl: mapboxgl,
    });
    
    //making search button at the top 
    geocoderContainer = document.createElement('div');
geocoderContainer.className = 'custom-geocoder-container';
geocoderContainer.appendChild(geocoder.onAdd(map));
map.getContainer().appendChild(geocoderContainer);

    
    
  
    // Add a marker to the map when the user clicks
    map.on('click', function(e) {
      // Get the latitude and longitude from the clicked location
      const lngLat = e.lngLat;
      const latitude = lngLat.lat;
      const longitude = lngLat.lng;
  
      // Perform reverse geocoding to get the human-readable address
      fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?access_token=${mapboxgl.accessToken}`)
        .then(response => response.json())
        .then(data => {
          const address = data.features[0].place_name;
          // Update the "Location" form field with the human-readable address
          const locationField = document.getElementById("loc-name");
          locationField.value = address;
        });
    });
  });



geocoder.on('result', function (e) {
    
    fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${mapboxgl.accessToken}`)

    .then(response => response.json())
    .then(data => {
      const address = data.features[0].place_name;
      // Update the "Location" form field with the human-readable address
      const locationField = document.getElementById("loc-name");
      locationField.value = address;
    });

});

  