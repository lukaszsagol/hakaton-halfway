hw.providers.facebook = function(args) {
  var self = {
    
    defaults: { distance: 1000, },
    opts: {},
    placesUrl: 'https://graph.facebook.com/search?q=%query&type=place&center=%lat,%lon&distance=%distance&access_token=%token&callback=?',
    
    auth: function(){
      
      self.opts = $.extend({}, self.defaults);
      
      FB.init({
        appId  : 165971536792687,
        status : true,
        cookie : true,
        xfbml  : true
      });

      FB.getLoginStatus(function(response) {
        if (response.session) {
          self.opts.token = response.session.access_token;
        }
      });

      FB.Event.subscribe('auth.sessionChange', function(response) {
        if (response.session) {
          self.opts.token = response.session.access_token;
        }
      });

      FB.Event.subscribe('auth.login', function(response) {
        if (response.session) {
          self.opts.token = response.session.access_token;
        }
      });
    },
    
    fetchFriends: function(){
      // to be implemented
    }, 
    
    search: function(query, icon) {
      hw_map.removePois();
      if(typeof icon === 'undefined')
        icon = false;
      position = hw_map.meetingPos;
      url = self.placesUrl.replace('%query', query).replace('%lat', position.lat()).replace('%lon', position.lng()).replace('%distance', self.opts.distance).replace('%token', self.opts.token);
      if(icon)
        icon_img = query;
      else
        icon_img = 'blank';
      
      $.getJSON(url, function(points) {
        hw_map.removePois();
        $.each(points.data, function(i, point) {
          hw_map.pois.push( new google.maps.Marker({
            position: new google.maps.LatLng(point.location.latitude, point.location.longitude),
            map: hw_map.map,
            title: point.name,
            icon: 'images/'+icon_img+'.png',
          }));
          marker = hw_map.pois[hw_map.pois.length-1];
          hw_map.bindInfoWindow(marker, marker.title);
        });
      });
    },
  }
  
  return self;
}
