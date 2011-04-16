hf = function(){
	var self = {
        showError: function(msg) {
            // TODO Jakis boxik
            alert(msg);
        },

        setFriendLocation: function(latitude, longitude, accuracy) {
            //
        },

        setOwnLocation: function(latitude, longitude, accuracy) {
            //
        },

        updateLocation: function() {
            if (!navigator.geolocation) {
                self.showError('Geolocalisation not suppoorted!');
                return;
            }
            navigator.geolocation.getCurrentPosition(
                function(pos) {
                    self.setOwnLocation(pos.coords.latitude, pos.coords.longitude, pos.coord.accuracy);
                },
                function(error) {
                    var code = error.code
                    if (code == 1) {
                        return; // ignoruj
                    }
                    self.showError('Could not find your location.');
                },
            );
	    },
	};
	return self;
}();
