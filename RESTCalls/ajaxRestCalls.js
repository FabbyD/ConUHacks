
function callback(result)
{
	//Vs écrivez ce que vous voulez faire avec le résultat de la requête...
	console.log(result);
}

function postRequest(callbackFct)
{

	$.ajax({

	  	type: 'POST',
	  	//URL du call
	  	url: 'https://api-alpha.clarifai.com/v1/token/',

	  	//Type des données de return
	  	dataType: "json",

	  	//Les datas a envoyé en paramètre (Des fois sont ajoutés directement
  		// a lurl après le '?' avec des '&'.
	  	data: {
		  	grant_type:"client_credentials",
		  	client_id: "doE72Z28rOEYtDCLvbALsMOJtY7Uakll7U0MhvAj",
		  	client_secret: "MTZPRyu9mkOpPU4pPRWIKqw2FBMxCOrFWk-Ewwtt"
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
	  		callbackFct(response);
	  	},

	  	error: function(){
	  		console.log("Errrreur")
	  	}
	});
}

postRequest(callback);