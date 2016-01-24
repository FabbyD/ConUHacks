var accessToken = '2739012414.2768f83.34d827d9701447c08c5fc596f6668f6c';

$.ajax({
    url: 'https://api.instagram.com/v1/media/popular',
    dataType: 'jsonp',
    type: 'GET',
    url: "https://api.instagram.com/v1/media/popular?access_token=2739012414.2768f83.34d827d9701447c08c5fc596f6668f6c",
    success: function(data){
        console.log(data);
        for(x in data.data){
          $('ul').append('<li><img src="'+data.data[x].images.low_resolution.url+'"></li>');  
        }
    },
    error: function(data){
        console.log(data);
    }
});
