hf = (function(){
	var self = {
        showError: function(msg) {
            // TODO Jakis boxik
            alert(msg);
        },

        setLocation: function(position) {
            console.log(position);
            alert('Jest dobrze!');
        },

        updateLocation: function() {
            if (!navigator.geolocation) {
                self.showError('Geolocalisation not suppoorted!');
                return;
            }
            navigator.geolocation.getCurrentPosition(self.setLocation, self.showError);
	    },
	};
	return self;
})();
