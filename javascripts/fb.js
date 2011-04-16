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
			$.getJSON(url, function(data){
				console.log(data);
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

FB.Event.subscribe('auth.login', function(response) {
  console.debug(response);

  if (response.session) {
    places = new fbPlaces({token: response.session.access_token});
		points = places.search(52.2296756, 21.0122287, 'coffe').data;
		$.each(data, function(i, point) {
		                new google.maps.Marker({
		                    position: new google.maps.LatLng(point.location.latitude, point.location.longitude),
		                    map: map,
		                    title: flat.name
		                });
		            );
		        });
  }
});
