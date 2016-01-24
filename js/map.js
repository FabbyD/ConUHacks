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
		navigator.geolocation.getCurrentPosition(function(pos) {
			  var temp = {
				lat: pos.coords.latitude,
				lng: pos.coords.longitude
			  };
			position.lat = temp.lat;
			position.lng = temp.lng;
			showMarker();
		});
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
    marker.setVisible(true);
}
function onPlaceChanged() {
  place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(12);
	
	// Smooth scrolling
	var offsets = document.getElementById('weather').getBoundingClientRect();
	var top = offsets.top;
	$('html, body').stop().animate({ scrollTop: top },500);
	
	// Weather forecast
	var location = place.geometry.location;
	console.log(location.lat(), location.lng())
	postRequest(callback, location.lat(), location.lng());
	
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter your destination';
  }
  determineRoute(directionsService, directionsDisplay);
  
  // Place photos
  var request = {
		location: place.geometry.location,
		radius: '500',
		query: place.name
	  };
	  
	var service = new google.maps.places.PlacesService(map);
	service.textSearch(request, callbackPlacesID);
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

function callbackPlacesID(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    console.log(results[0].place_id);
	var request = {
	  placeId: results[0].place_id
	};
	service = new google.maps.places.PlacesService(map);
	service.getDetails(request, callbackDetails);
  }
}

function callbackDetails(place, status) {
	 if (status == google.maps.places.PlacesServiceStatus.OK) {
		console.log(place);
		var photos = place.photos;
		if (!photos) {
			// NO PHOTOS AVAILABLE
			return;
		}
		$('#pictures').attr("src","");
		for (i = 0; i < 4; i++) {
			$('ul').append('<li><img src="'+photos[i].getUrl({'maxWidth': 400, 'maxHeight': 400})+'"></li>');
		}
	  }
}

// Change the weather values when the fetch is complete
function callback(result)
{
	console.log(result);
	array = result;		
		
	document.querySelector('#MonDay').innerHTML = Math.round(array.list[0].temp.day) + "°C";
	document.querySelector('#MonNight').innerHTML = Math.round(array.list[0].temp.night) + "°C";
	
	document.querySelector('#TueDay').innerHTML = Math.round(array.list[1].temp.day) + "°C";
	document.querySelector('#TueNight').innerHTML = Math.round(array.list[1].temp.night) + "°C";
	
	document.querySelector('#WedDay').innerHTML = Math.round(array.list[2].temp.day) + "°C";
	document.querySelector('#WedNight').innerHTML = Math.round(array.list[2].temp.night) + "°C";
	
	document.querySelector('#ThuDay').innerHTML = Math.round(array.list[3].temp.day) + "°C";
	document.querySelector('#ThuNight').innerHTML = Math.round(array.list[3].temp.night) + "°C";
	
	document.querySelector('#FriDay').innerHTML = Math.round(array.list[4].temp.day) + "°C";
	document.querySelector('#FriNight').innerHTML = Math.round(array.list[4].temp.night) + "°C";
	
	document.querySelector('#SatDay').innerHTML = Math.round(array.list[5].temp.day) + "°C";
	document.querySelector('#SatNight').innerHTML = Math.round(array.list[5].temp.night) + "°C";
	
	document.querySelector('#SunDay').innerHTML = Math.round(array.list[6].temp.day) + "°C";
	document.querySelector('#SunNight').innerHTML = Math.round(array.list[6].temp.night) + "°C";
}

// Call the weather API
function postRequest(callbackFct, lat, lon)
{
	$.ajax({
	  	url: 'http://api.openweathermap.org/data/2.5/forecast/daily?APPID=1bbc39a35ea1c3ebe62231e0765c9e5a&cnt=7&units=metric&lat=' + lat + '&lon=' + lon,

	  	success: function(response) {
	  		callbackFct(response);
	  	},

	  	error: function(){
	  		console.log("Errrreur")
	  	}
	});
}
