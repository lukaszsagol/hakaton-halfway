hw_map = (function() {
  var self = {
    myPos: null,
    myMarker: null,
    meetingPos: null,
    meetingPosInfo: null,
    meetingMarker: null,
    map: null,
    accuracyColor: '#ff9000',
    friends: [],
    pois: [],
    infoWindow: null,
    geocoder: null,
    minZoom: 17,

    init: function() {
      self.setMyPosition(52.219505, 21.012436);
      self.map = new google.maps.Map($('#map_canvas')[0], {
        zoom: self.minZoom,
        center: self.myPos,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      });
      self.infoWindow = new google.maps.InfoWindow;
      self.geocoder = new google.maps.Geocoder();
      self.meetingMarker = new google.maps.Marker({
        map: self.map,
        icon: 'images/regroup.png',
        flat: true,
        draggable: false,
        clickable: true,
        zIndex: 10000,
      });
      self.updateMyMarker();
      self.updateLocation();
    },

    bindActions: function() {
      $('#add_friend').click(function() { 
        var adr = $('#friend_address').val(); 
        if (adr === '') {
          self.addFriend(); 
        } else {
          self.geocodeFriend(adr);
        }
        $('#friend_address').val('');
      });
    },

    addFriend: function(latlng, draggable) {
      if(typeof draggable == 'undefined')
        var draggable = true;

      if (!latlng) 
        var latlng = self.map.getCenter()

      var friend = {
        marker: new google.maps.Marker({
          map: self.map,
          draggable: draggable,
          icon: 'images/friends.png',
          flat: true,
          clickable: true,
          position: latlng,
          }),
          latitude: latlng.lat(),
          longitude: latlng.lng(),
      }
      google.maps.event.addListener(friend.marker, 'dragend', function (event) {
        friend.latitude = event.latLng.lat();
        friend.longitude = event.latLng.lng();
      });
      self.friends.push(friend)
      hw.updateStatusbar();
      self.reZoom();
    },

    reZoom: function() {
      var bounds = new google.maps.LatLngBounds();
      for (var friend in self.friends) {
        friend = self.friends[friend];
        bounds.extend(new google.maps.LatLng(friend.latitude, friend.longitude));
      }
      bounds.extend(self.myPos);
      self.map.fitBounds(bounds);
      if (self.map.getZoom() > self.minZoom) {
        self.map.setZoom(self.minZoom);
      }
      self.map.setCenter(bounds.getCenter());
    },

    removeFriend: function(friend) {
      self.friends.push(friend)
      if (typeof friend.marker == 'undefined') {
      }
    },

    setMyPosition: function(latitude, longitude) {
      self.myPos = new google.maps.LatLng(latitude, longitude);
    },

    updateMyMarker: function() {
      if (!self.myMarker) {
        self.myMarker = new google.maps.Marker({
          map: self.map,
          icon: 'images/me.png',
          flat: true,
          draggable: true,
          clickable: false,
        });
      }
      self.myMarker.setPosition(self.myPos);
      self.map.setCenter(self.myPos);
      google.maps.event.addListener(self.myMarker, 'dragend', function (event) {
        self.myPos = event.latLng;
      });
    },

    sphericalToCartesian: function(latitude, longitude) {
      latitude = (latitude / 180) * Math.PI;
      longitude = (longitude / 180) * Math.PI;
      return {
        x: Math.cos(latitude) * Math.cos(longitude),
        y: Math.cos(latitude) * Math.sin(longitude),
        z: Math.sin(latitude),
      };
    },

    updateMeetingPoint: function() {
      var clat = self.myPos.lat();
      var current = self.sphericalToCartesian(clat, self.myPos.lng());
      var count = 1;

      for (var friend in self.friends) {
        friend = self.friends[friend];
        var f = self.sphericalToCartesian(friend.latitude, friend.longitude);
        clat += friend.latitude
        current.x += f.x;
        current.y += f.y;
        current.z += f.z;
        count++;
      }
      
      clat /= count;
      current.x /= count;
      current.y /= count;
      current.z /= count;

      var latitude = (Math.atan2(current.z, Math.sqrt(current.x * current.x + current.y * current.y)) / Math.PI) * 180;
      var longitude = (Math.atan2(current.y, current.x) / Math.PI) * 180;
      var uglyness = Math.abs(latitude) / 90;
      var latitude = clat * uglyness + latitude * (1-uglyness);

      self.meetingPos = new google.maps.LatLng(latitude, longitude);
      self.meetingPosInfo = self.meetingPos.toString();
      self.geocoder.geocode({'latLng': self.meetingPos}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          self.meetingPos = results[0].geometry.location;
          self.meetingPosInfo = results[0].formatted_address;
        }
        self.meetingMarker.setPosition(self.meetingPos);
        self.map.setCenter(self.meetingPos);
        self.infoWindow.setContent(self.meetingPosInfo);
        self.infoWindow.open(self.map, self.meetingMarker);
      });
    },

    removePois: function() {
      while(self.pois.length > 0) {
        poi = self.pois.pop()
        poi.setMap();
        delete poi;
      }
    },

    bindInfoWindow: function (marker, html) {
      google.maps.event.addListener(marker, 'click', function() {
        self.infoWindow.setContent(html);
        self.infoWindow.open(self.map, marker);
      });
    },

    geocodeFriend: function(address) {
      if(address === '')
      return;
      self.geocoder.geocode({'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          self.addFriend(results[0].geometry.location);
        } else {
          alert("Couldn't find that address. Please try  again!");
        }
      });
    },

    updateLocation: function() {
      if (!navigator.geolocation) {
        hw.showError('Geolocalisation not suppoorted!');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        function(pos) {
          self.setMyPosition(pos.coords.latitude, pos.coords.longitude);
          self.updateMyMarker();
        },
        function(error) {
          var code = error.code
          if (code == 1) {
            console.log('Geolocalisation cancelled');
            return; // ignoruj
          }
          hw.showError('Could not find your location.');
        }
      );
    },

  };
  return self;
})();

$(function() {
  hw_map.init();
  hw_map.bindActions();
});
