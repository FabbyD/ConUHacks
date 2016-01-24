/**
 * Created by Fabrice on 2016-01-23.
 */

 $(document).ready(function() {
	var input = document.getElementById('placeInput');
	autocomplete = new google.maps.places.Autocomplete(input, {
		types: ['(cities)']
	}); 
	
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
	temporaryInfo();
	
	// Smooth scrolling
	var offsets = document.getElementById('weather').getBoundingClientRect();
	var top = offsets.top;
	$('html, body').stop().animate({ scrollTop: top },500);
	
	// Weather forecast
	var location = place.geometry.location;
	console.log(location.lat(), location.lng())
	postRequest(callback, location.lat(), location.lng());
	
	// Travel information
	postRequestSita(sitaCallback, location.lat(), location.lng());
	
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
			console.log("No photos available");
			// NO PHOTOS AVAILABLE
			return;
		}
		
		$('#photoTest').attr('src',photos[0].getUrl({'maxWidth': 100, 'maxHeight': 100}));
		
		//var x = document.querySelectorAll(".photo");
		//for (i = 0; i < 6; i++) {
		//	x[i].setAttribute('src',"photos[i].getUrl({'maxWidth': 100, 'maxHeight': 100})");
		//}
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

// Call the SITA API
function postRequestSita(callbackFct, lat, lon)
{
	$.ajax({
	  	url: 'https://airport.api.aero/airport/nearest/' + lat + '/' + lon + '?maxAirports=1&user_key=1e4c64c11c940df94c374eb7d70fcef3',
		
		dataType: 'jsonp',
		
	  	success: function(response) {
	  		callbackFct(response);
	  	},

	  	error: function(){
	  		console.log("Errrreur")
	  	}
	});
}

// Change airports codes when the fetch is complete
function sitaCallback(result)
{
	document.querySelector('#startCode').innerHTML = "YUL";
	document.querySelector('#destCode').innerHTML = result.airports[0].code;
	console.log(result.airports[0].code);
	postRequestQpx(qpxCallback, "AAA", "AAA");
	
}

// Call the QPX API
function postRequestQpx(callbackFct, startCode, destCode)
{
	
	var str = '{"request": {"passengers": {"adultCount": 1},"slice": [{"origin": "BOS","destination": "LAX","date": "2016-01-30"}]}}';
	var json = JSON.parse(str);
	
	json.request.slice[0].origin = "YUL";
	json.request.slice[0].destination = document.querySelector('#destCode').innerHTML;
	
	$.ajax({
	  	type: 'POST',
	  	
	  	url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyCay_06Oh2fber3S1wpvdHiSxuKuzI9rUc',
		
		contentType: "application/json",

	  	dataType: "json",

	  	data: JSON.stringify(json),

	  	success: function(response) {
	  		callbackFct(response);
			console.log(json);
	  	},

	  	error: function(response){
	  		console.log("QPX Error");
	  	}
	});
}

// QPX callback
function qpxCallback(result)
{
	if (result.trips.tripOption)
	{
		console.log(result);
		document.querySelector('#flightPrice').innerHTML = result.trips.tripOption[0].saleTotal;
		document.querySelector('#flightDuration').innerHTML = result.trips.tripOption[0].slice[0].duration + " mins";
		document.querySelector('#flightCarrier').innerHTML = result.trips.tripOption[0].slice[0].segment[0].flight.carrier;
		document.querySelector('#flightNo').innerHTML = result.trips.tripOption[0].slice[0].segment[0].flight.number;
	}
	else 
	{
		document.querySelector('#flightPrice').innerHTML = "N/A";
		document.querySelector('#flightDuration').innerHTML = "N/A";
		document.querySelector('#flightCarrier').innerHTML = "N/A";
		document.querySelector('#flightNo').innerHTML = "N/A";
	}
	
}

function temporaryInfo()
{
	document.querySelector('#startCode').innerHTML = "fetching...";
	document.querySelector('#destCode').innerHTML = "fetching...";
	document.querySelector('#flightPrice').innerHTML = "fetching...";
	document.querySelector('#flightDuration').innerHTML = "fetching...";
	document.querySelector('#flightCarrier').innerHTML = "fetching...";
	document.querySelector('#flightNo').innerHTML = "fetching...";
}
