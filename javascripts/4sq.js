hw.providers.foursquare = function(args) {

  var defaults = {
    clientId: 'UDAVXWZTHSGXF4WETBZ0PQZDS3PDEQZB1SPSFUQO3ZTHSNUN',
    callbackUrl: 'http%3A%2F%2Fhalfway.schranz.io%2F%23!%2Fapp%3Dfoursquare',
    distance: 1000,
  };
  
  var opts = $.extend({}, defaults, args);
  
  var foursquareAuthUrl= 'https://foursquare.com/oauth2/authenticate' +
    '?client_id=' + opts.clientId +
    '&response_type=token' +
    '&redirect_uri=' + opts.callbackUrl;

  var self = {
    auth: function() {
      accessToken = localStorage.getItem("4sq_access_token");
      if(accessToken !== null) { 
        return; // already authorized
      } else {
        // try parsing url
        regexp = new RegExp(/access_token=([^&]+)/gi);
        accessToken = regexp.exec(window.location.hash);
        if(accessToken !== null){
          accessToken = accessToken[1];
          localStorage.setItem('4sq_access_token', accessToken);
        } else
          window.location.replace(foursquareAuthUrl);
      }
    },
    
    fetchFriends: function() {
      $.getJSON('https://api.foursquare.com/v2/checkins/recent?oauth_token='+accessToken+'&callback=?', function(data) {
        $.each(data.response.recent, function(i, checkin) {
          image = new google.maps.MarkerImage(checkin.user.photo, null, null, null, new google.maps.Size(32,32));
          hw_map.pois.push( new google.maps.Marker({
            position: new google.maps.LatLng(checkin.venue.location.lat, checkin.venue.location.lng),
            map: hw_map.map,
            title: checkin.user.firstName+' @ '+checkin.venue.name,
            icon: image,
          }));

          marker = hw_map.pois[hw_map.pois.length-1];
          hw_map.bindInfoWindow(marker, marker.title);
        });
      });
    },
  }
  
  return self;
}