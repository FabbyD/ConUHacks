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
    var johnMolson = {lat: 45.495261, lng: -73.578760};
    map = new google.maps.Map(document.getElementById('contact'), {
        center: johnMolson,
        zoom: 15,
		scrollwheel: false
    });

    marker = new google.maps.Marker({
        position: johnMolson,
        map: map
    });
    marker.setVisible(true);
}

function onPlaceChanged() {
  var place = autocomplete.getPlace();
  if (place.geometry) {
    map.panTo(place.geometry.location);
    map.setZoom(12);
    search();
  } else {
    document.getElementById('autocomplete').placeholder = 'Enter your destination';
  }
}