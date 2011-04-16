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

        createMap: function() {
            self.myPos = new google.maps.LatLng(52.219505, 21.012436),
            self.map = new google.maps.Map($('#map_canvas')[0], {
                zoom: 17,
                center: self.myPos,
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
            hw_map.infoWindow = new google.maps.InfoWindow;
            hw_map.geocoder = new google.maps.Geocoder();
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
                    shadow: 'images/shadow.png',
                    clickable: true,
                    position: latlng,
                }),
                latitude: pos.lat(),
                longitude: pos.lng(),
            }
            self.friends.push(friend)
            hw.updateStatusbar();
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
                    shadow: 'images/shadow.png',
                    draggable: true,
                    clickable: false,
                });
            }
            self.myMarker.setPosition(self.myPos);
            self.map.setCenter(self.myPos);
            google.maps.event.addListener(self.myMarker, 'dragend', function (evt) {
                self.myPos = evt.latLng;
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
            self.meetingPos = new google.maps.LatLng(latitude, longitude);
            if (!self.meetingMarker) {
                self.meetingMarker = new google.maps.Marker({
                    map: self.map,
                    icon: 'images/regroup.png',
                    shadow: 'images/shadow.png',
                    draggable: false,
                    clickable: false,
                });
            }
            self.meetingMarker.setPosition(self.meetingPos);
        },
        
        removePois: function() {
            while(hw_map.pois.length > 0) {
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
        },
        
        geocodeFriend: function(address) {
          hw_map.geocoder.geocode({'address': address}, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                 // map.setCenter(results[0].geometry.location);
                  hw_map.addFriend(results[0].geometry.location);
                  // var marker = new google.maps.Marker({
                  //                      map: hw_map.map,
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
    $('#add_friend').click(hw_map.addFriend);
    $('#update_meetingpoint').click(hw_map.updateMeetingPoint);
});
