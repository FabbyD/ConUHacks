function callback(result)
{
	//Vs écrivez ce que vous voulez faire avec le résultat de la requête...
	console.log(result);
}

function photosRequest(callbackFct)
{

	$.ajax({

	  	type: 'GET',
	  	//URL du call
	  	url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=-33.8670522,151.1957362&',

	  	//Type des données de return
	  	dataType: "json",

	  	//Les datas a envoyé en paramètre (Des fois sont ajoutés directement
  		// a lurl après le '?' avec des '&'.
	  	data: {
			radius=500,
			key=AIzaSyA1rgCGVQtLfQMPVmpzyOAf9E-8E3ilmJM
		},

		xhrFields: {
	    // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
	    // This can be used to set the 'withCredentials' property.
	    // Set the value to 'true' if you'd like to pass cookies to the server.
	    // If this is enabled, your server must respond with the header
	    // 'Access-Control-Allow-Credentials: true'.
	    withCredentials: false
	  },

	  	headers: {
	    // Set any custom headers here.
	    // If you set any non-simple headers, your server must include these
	    // headers in the 'Access-Control-Allow-Headers' response header.
	  },

	  	success: function(response) {
	  		console.log('Lets go le gros')
	  	},

	  	error: function(){
	  		console.log("Errrreur")
	  	}
	});
}

photosRequest(callback);