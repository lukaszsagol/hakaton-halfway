var fbPlaces = function(args) {
	
	var defaults = {
		distance: 1000,
	}
	var opts = $.extend({}, defaults, args);
	
	var placesUrl = 'https://graph.facebook.com/search?q=%query&type=place&center=%lat,%lon&distance=%distance&access_token=%token&callback=?';
	

	return {
		search: function(lat, lon, query) {
			url = placesUrl.replace('%query', query)
							.replace('%lat', lat)
							.replace('%lon', lon)
							.replace('%distance', opts.distance)
							.replace('%token', opts.token);
			$.getJSON(url, function(points){
			  var pois = [];
			  console.log(points);
			  console.log(window.map);
				$.each(points.data, function(i, point) {
				  console.log(point);
    		                pois.push( new google.maps.Marker({
    		                    position: new google.maps.LatLng(point.location.latitude, point.location.longitude),
    		                    map: window.map,
    		                    title: point.name
    		                }));

    		        });
			});
		}
	}
}


FB.init({
  appId  : 165971536792687,
  status : true,
  cookie : true,
  xfbml  : true
});

FB.getLoginStatus(function(response) {
  if (response.session) {
    places = new fbPlaces({token: response.session.access_token});
		places.search(52.2296756, 21.0122287, 'coffe');
		
  }
});
