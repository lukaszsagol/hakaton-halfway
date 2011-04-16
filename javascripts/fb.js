var fbPlaces = function(args) {
	
	var defaults = {
		distance: 1000,
	}
	var opts = $.extend({}, defaults, args);
	var infowindow = new google.maps.InfoWindow({
    content: ''
  });
	
	var placesUrl = 'https://graph.facebook.com/search?q=%query&type=place&center=%lat,%lon&distance=%distance&access_token=%token&callback=?';
  
	return {
		search: function(query) {
		  position = hw_map.myMarker.getPosition();
			url = placesUrl.replace('%query', query)
							.replace('%lat', position.lat())
							.replace('%lon', position.lng())
							.replace('%distance', opts.distance)
							.replace('%token', opts.token);
			$.getJSON(url, function(points){
			  hw_map.removePois();
			  console.log(points.data);
			  $.each(points.data, function(i, point) {
          hw_map.pois.push( new google.maps.Marker({
            position: new google.maps.LatLng(point.location.latitude, point.location.longitude),
            map: hw_map.map,
            title: point.name
          }));
          google.maps.event.addListener(hw_map.pois[hw_map.pois.length-1], 'click', function() {
            fbPlaces.infowindow.setContent('<h2>'+marker.title+'</h2>');
            fbPlaces.infowindow.open(hw_map.map,hw_map.pois[hw_map.pois.length-1]);
          });
        });
        
                   
			});
		}
	}
}
