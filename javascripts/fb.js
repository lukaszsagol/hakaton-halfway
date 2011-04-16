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
			  hw_map.pois.empty();
			  $.each(points.data, function(i, point) {
          hw_map.pois.push( new google.maps.Marker({
            position: new google.maps.LatLng(point.location.latitude, point.location.longitude),
            map: hw_map.map,
            title: point.name
          }));
        });        
			});
		}
	}
}
