function callInsta() {
	console.log('Instafeed');	
	 $.ajax({
      type: "GET",
      dataType: "jsonp",
      cache: false,
      url: "https://api.instagram.com/v1/media/popular?access_token=2739012414.2768f83.34d827d9701447c08c5fc596f6668f6c",
      success: function(data) {
        for (var i = 0; i < 6; i++) {
          $(".popular").append("<li><a target='_blank' href='" + data.data[i].link + "'><img src='" + data.data[i].images.low_resolution.url + "'></img></a></li>");
		}
      }
     })
}
