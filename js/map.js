/**
 * Created by Fabrice on 2016-01-23.
 */

var map;
var marker;
function initMap() {
    var johnMolson = {lat: 45.495261, lng: -73.578760};
    map = new google.maps.Map(document.getElementById('contact'), {
        center: johnMolson,
        zoom: 15
    });

    marker = new google.maps.Marker({
        position: johnMolson,
        map: map
    });
    marker.setVisible(true);
}
