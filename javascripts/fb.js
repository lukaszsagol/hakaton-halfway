# empty

var fbPlaces = function(args) {
	
	var defaults = {
		distance: 1000,
	}
	var opts = $.extend({}, defaults, args);
	
	var placesUrl = 'https://graph.facebook.com/search?q=%query&type=place&center=%lat,%lon&distance=%distance&access_token=%token&callback=';
	
	var search(lat, lon, query) {
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