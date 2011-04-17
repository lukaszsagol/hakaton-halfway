hw_map = (function() {
    var self = {
        myPos: null,
        myMarker: null,
        meetingPos: null,
        meetingMarker: null,
        map: null,
        accuracyColor: '#ff9000',
        friends: [],
        pois: [],
        infoWindow: null,
        geocoder: null,
        minZoom: 17,

        createMap: function() {
            self.myPos = new google.maps.LatLng(52.219505, 21.012436),
            self.map = new google.maps.Map($('#map_canvas')[0], {
                zoom: self.minZoom,
                center: self.myPos,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            self.infoWindow = new google.maps.InfoWindow;
            self.geocoder = new google.maps.Geocoder();
        },

        addFriend: function(latlng, draggable) {
            if(typeof draggable == 'undefined')
              var draggable = true;
              
            if (!latlng) 
                var latlng = self.map.getCenter()
            
            var friend = {
                name: 'What was his name again?',
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

        updateMeetingPoint: function() {
            // We're on a flat disc!!! Who said we live on a sphere!?!?!?
            var latitude = self.myPos.lat();
            var longitude = self.myPos.lng();
            var count = 1;
            for (var friend in self.friends) {
                friend = self.friends[friend];
                latitude += friend.latitude;
                longitude += friend.longitude;
                count++;
            }
            latitude /= count;
            longitude /= count;
            meetPoint = new google.maps.LatLng(latitude, longitude);
            hw_map.geocoder.geocode({'latLng': meetPoint}, function(results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                  console.log(results[1]);
                  infowindow.setContent(results[1].formatted_address);
                  infowindow.open(map, marker);
                }
              } else {
                
              }
            });
            self.meetingPos = meetPoint;
            if (!self.meetingMarker) {
                self.meetingMarker = new google.maps.Marker({
                    map: self.map,
                    icon: 'images/regroup.png',
                    flat: true,
                    draggable: false,
                    clickable: false,
                    zIndex: 1000,
                });
            }
            self.meetingMarker.setPosition(self.meetingPos);
            self.map.setCenter(self.meetingPos);
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
                self.infoWindow.open(hw_map.map, marker);
            });
        },
        
        geocodeFriend: function(address) {
          if(address === '')
            return;
          self.geocoder.geocode({'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                 // map.setCenter(results[0].geometry.location);
                  self.addFriend(results[0].geometry.location);
                  // var marker = new google.maps.Marker({
                  //                      map: self.map,
                  //                      position: results[0].geometry.location
                  //                  });
                } else {
                  alert("Geocode was not successful for the following reason: " + status);
                }
              });
        }
    };
    return self;
})();

$(function() {
    hw_map.createMap();
    $('#add_friend').click(function() { 
      var adr = $('#friend_address').val(); 
      if (adr === '') {
        hw_map.addFriend(); 
      } else {
        hw_map.geocodeFriend(adr);
      }
      $('#friend_address').val('');
    });
});
