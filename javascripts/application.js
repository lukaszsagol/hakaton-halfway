hw = (function() {
	var self = {
    places: null,
	      
	  init: function() {
	  FB.init({
      appId  : 165971536792687,
      status : true,
      cookie : true,
      xfbml  : true
    });

    FB.getLoginStatus(function(response) {
      if (response.session) {
        hw.places = new fbPlaces({token: response.session.access_token});
      } else {
    		$('#overlay').show();
      }
    });
  },
  bindActions: function() {
    $('#search_form').submit(function(e) {
      e.preventDefault();
      hw.places.search(52.219505,21.01243599999998,$('#search_query').val());
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

hw.init();
hw.bindActions();
