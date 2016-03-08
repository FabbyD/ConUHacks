
 $(document).ready(function() {
	var input = document.getElementById('placeInput');
	autocomplete = new google.maps.places.Autocomplete(input); 
	autocomplete.addListener('place_changed', onPlaceChanged);
	
	// Closes the sidebar menu
    $("#menu-close").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });

    // Opens the sidebar menu
    $("#menu-toggle").click(function(e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });
	
	// Bottom smooth scroll button
	var offsets = document.getElementById('top').getBoundingClientRect();
	var top = offsets.top;
	$( "#scrollUp" ).click(function() {
		$('html, body').stop().animate({ scrollTop: top },500);
	});
	
	// Weather week days
	var weekday = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
	var date = new Date();
	var day = date.getDay() + 1; // Forecast starts tomorrow.
	for (i = 0; i < 7; i++){
		$('#day' + i + 'Title').html(weekday[(day + i) % 7]);
	}
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

	// Place photos
	var request = {
		location: place.geometry.location,
		radius: '500',
		query: place.name
	};

	var service = new google.maps.places.PlacesService(map);
	service.textSearch(request, callbackPlacesID);

	if (place.geometry) {
		$("#pictures").show();
		$("#photosCheck").attr("checked",true);
		$("#weather").show();
		$("#weatherCheck").attr("checked",true);
		$("#travel").show();
		$("#travelCheck").attr("checked",true);
		$("#about").show();
		$("footer").show();
		$("#contact").show();
		$("#mapCheck").attr("checked",true);
		initMap();


		map.panTo(place.geometry.location);
		map.setZoom(12);
		temporaryInfo();



		// Weather forecast
		var location = place.geometry.location;
		console.log(location.lat(), location.lng())
		postRequest(callback, location.lat(), location.lng());

		// Travel information
		postRequestSita(sitaCallback, location.lat(), location.lng());

		// Smooth scroll down
		var offsets = document.getElementById('pictures').getBoundingClientRect();
		var top = offsets.top;
		$('html, body').stop().animate({ scrollTop: top },500);
	}
	else {
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
		
		var x = document.querySelectorAll(".photo");
		for (i = 0; i < 6; i++) {
			x[i].setAttribute('src', '');
		}
		
		if (!photos) {
			// NO PHOTOS AVAILABLE
			$("#noPictures").html("Sorry, no pictures available for this destination.");
			return;
		}
		$("#noPictures").html("");
		for (i = 0; i < 6; i++) {
			if (photos[i]) {
				x[i].setAttribute('src',photos[i].getUrl({'maxWidth': 300, 'maxHeight': 300}));
			}
			else {
				return;
			}
		}
	}
}

// Change the weather values when the fetch is complete
function callback(result)
{
	console.log(result);
	array = result;		
	
	for (i = 0; i < 7; i++){
		document.querySelector('#day' + i).innerHTML = Math.round(array.list[i].temp.day) + "°C";
		document.querySelector('#night' + i).innerHTML = Math.round(array.list[i].temp.night) + "°C";
	}
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
	var date = new Date(); // Get today's date.
	date.setDate(date.getDate() + 7); // Add 7 days to get informations one week from now.
	date.setMonth(date.getMonth() + 1); // Correct the month (we want 1 to 12).
	var formattedDate = date.getFullYear() + '-' + ('0' + date.getMonth()).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	var str = '{"request": {"passengers": {"adultCount": 1},"slice": [{"origin": "BOS","destination": "LAX","date": "' + formattedDate + '"}]}}';
	var json = JSON.parse(str);
	
	json.request.slice[0].origin = "YUL";
	json.request.slice[0].destination = document.querySelector('#destCode').innerHTML;
	
	console.log(json);
	
	$.ajax({
	  	type: 'POST',
	  	
	  	url: 'https://www.googleapis.com/qpxExpress/v1/trips/search?key=AIzaSyA1rgCGVQtLfQMPVmpzyOAf9E-8E3ilmJM',
		
		contentType: "application/json",

	  	dataType: "json",

	  	data: JSON.stringify(json),

	  	success: function(response) {
	  		callbackFct(response);
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
	$('#instaTitle').html(place.name);
	document.querySelector('#startCode').innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
	document.querySelector('#destCode').innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
	document.querySelector('#flightPrice').innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
	document.querySelector('#flightDuration').innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
	document.querySelector('#flightCarrier').innerHTML = '<i class="fa fa-spinner fa-spin"></i>';
	document.querySelector('#flightNo').innerHTML = '<i class="fa fa-spinner fa-spin"></i>';;
}
