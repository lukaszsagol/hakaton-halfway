hw = (function() {
	var self = {
	  
	      init: function() {
	        
	      },
	      bindActions: function() {
	        console.log('asdf');
	        $('#search_form').submit(function(e) {
	          e.preventDefault();
	          fbPlaces.search(52,21,$('search_query').val());
	        });
	        $('#refresh_location').click(hw.updateLocation);
	      },
        showError: function(msg) {
            // TODO Jakis boxik
            alert(msg);
        },

        setFriendLocation: function(latitude, longitude, accuracy) {
            //
        },

        setOwnLocation: function(latitude, longitude, accuracy) {
            hw_map.updateMyMarker(latitude, longitude, accuracy);
        },

        updateLocation: function() {
            if (!navigator.geolocation) {
                self.showError('Geolocalisation not suppoorted!');
                return;
            }
            navigator.geolocation.getCurrentPosition(
                function(pos) {
                    self.setOwnLocation(pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy);
                },
                function(error) {
                    var code = error.code
                    if (code == 1) {
                        return; // ignoruj
                    }
                    self.showError('Could not find your location.');
                }
            );
	    },
	};
	return self;
})();
