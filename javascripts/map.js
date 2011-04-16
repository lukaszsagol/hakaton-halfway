hw_map = (function() {
  var self = {
    myMarker: null,
    myAccuracy: null,
    map: null,
    accuracyColor: '#ff9000',
    friends: [],
    pois: [],
    infoWindow: null,

    createMap: function() {
      self.map = new google.maps.Map($('#map_canvas')[0], {
        zoom: 17,
        center: new google.maps.LatLng(52.219505, 21.012436),
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      hw_map.infoWindow = new google.maps.InfoWindow;
    },

    addFriend: function() {
      var friend = {
        name: 'What was his name again?',
        marker: new google.maps.Marker({
          map: self.map,
          draggable: true,
          clickable: true,
          position: self.map.getCenter(),
        }),
      }
      self.friends.push(friend)
    },

    removeFriend: function(friend) {
      self.friends.push(friend)
      if (typeof friend.marker == 'undefined') {
      }
    },

    updateMyMarker: function(latitude, longitude, accuracy) {
      var pos = new google.maps.LatLng(latitude, longitude);
      if (!self.myMarker) {
        self.myMarker = new google.maps.Marker({
          map: self.map,
          clickable: false,
        });
      }
      self.myMarker.setPosition(pos);
      if (typeof accuracy != 'undefined' && accuracy) {
        if (!self.myAccuracy) {
          self.myAccuracy = new google.maps.Circle({
            map: self.map,
            clickable: false,
            fillColor: self.accuracyColor,
            fillOpacity: 0.2,
            strokeColor: self.accuracyColor,
            strokeOpacity: 0.4,
            strokeWeight: 1,
            zIndex: -9000,
          });
        }
        self.myAccuracy.setCenter(pos);
        self.myAccuracy.setRadius(accuracy);
      } else if (self.myAccuracy) {
        self.myAccuracy.setMap(null);
        self.myAccuracy = null;
      }
      self.map.setCenter(pos);
    },

    removePois: function() {
      while(hw_map.pois.length > 0)
      {
        poi = hw_map.pois.pop()
        poi.setMap();
        delete poi;
      }
    },

    bindInfoWindow: function (marker, html) {
      google.maps.event.addListener(marker, 'click', function() {
        hw_map.infoWindow.setContent(html);
        hw_map.infoWindow.open(hw_map.map, marker);
      });
    }
  };
  
  return self;
})();

$(function() {
  hw_map.createMap();
  $('#add_friend').click(hw_map.addFriend);
});
