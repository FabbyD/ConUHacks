/**
 * Created by Fabrice on 2016-01-23.
 */

 $(document).ready(function() {
	var input = document.getElementById('placeInput');
	autocomplete = new google.maps.places.Autocomplete(input); 
	
	autocomplete.addListener('place_changed', onPlaceChanged);
	
	});
 
var map;
var marker;
function initMap() {
    position= {lat: 45.495261, lng: -73.578760};;
	directionsService = new google.maps.DirectionsService;
	directionsDisplay = new google.maps.DirectionsRenderer;
	if (navigator.geolocation) {
			console.log("ici1");
		navigator.geolocation.getCurrentPosition(function(pos) {
			console.log("ici2");
			  var temp = {
				lat: pos.coords.latitude,
				lng: pos.coords.longitude
			  };
			console.log("ici3");
			position.lat = temp.lat;
			position.lng = temp.lng;
			showMarker();
		});
			console.log("ici4");
	}
	else{
		
	}
    map = new google.maps.Map(document.getElementById('contact'), {
        center: position,
        zoom: 15,
		scrollwheel: false
    });
	directionsDisplay.setMap(map);
	
}

function showMarker(){
	marker = new google.maps.Marker({
        position: position,
        map: map
    });
	console.log(position);
    marker.setVisible(true);
}
function onPlaceChanged() {
  place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(12);
	marker.setPosition(place.geometry.location);
	
	// Smooth scrolling
	var offsets = document.getElementById('portfolio').getBoundingClientRect();
	var top = offsets.top;
	$('html, body').stop().animate({ scrollTop: top },500);
			
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter your destination';
  }
  determineRoute(directionsService, directionsDisplay);
}


function determineRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: position,
    destination: place.geometry.location,
    travelMode: google.maps.TravelMode.WALKING
  }, function(response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
       document.getElementById("routeInfos").innerHTML ="Sorry! No directions available.";
    }
  });
}