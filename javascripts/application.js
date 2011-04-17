hw = (function() {
	var self = {
    places: null,
    providers: {},
	      
	  init: function() {
	    
	    regexp = new RegExp(/app=([^&]+)/gi);
      app = regexp.exec(window.location.hash)[1];
      
      if(app === null)
      {
        $('#overlay').show();
      }
      else
      {
        hw.dataProvider = self.providers[app]({});
        hw.dataProvider.auth();
        hw.dataProvider.fetchFriends();

        self.updateLocation();
      }
    },

    bindActions: function() {
      $('#search_query').keypress(function(e) {
        if (e.which==13) {
          $('#categories li a').removeClass('active');
          e.preventDefault();
          hw.places.search($(this).val());
        }
      });
    
      $('#friend_address').keypress(function(e) {
        if (e.which==13) {
          e.preventDefault();
          if($(this).val() === '')
            if(!confirm('Just add new point?'))
              return;

          hw_map.geocodeFriend($(this).val());
          $(this).val('');
        }
      });

      $('#categories li.link a').click(function() {
        $('#categories li a').removeClass('active');
        hw.places.search(this.innerText, true);
        $(this).addClass('active');
      });
    },

    updateStatusbar: function() {
      $('#statusbar').html("You will meet with "+hw_map.friends.length+" friends. <a href='#' class='update_meetingpoint'>Display our meeting point!</a>");
      $('.update_meetingpoint').click(function() {
        hw_map.updateMeetingPoint();
        $('#statusbar').hide();
        $('#friend_searcher').hide();
        $('#categories').show();
        $('#start_over').show();
      });
    },

    showError: function(msg) {
        alert(msg);
    },

    setOwnLocation: function(latitude, longitude, accuracy) {
      hw_map.setMyPosition(latitude, longitude);
      hw_map.updateMyMarker();
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

jQuery(function($) {
	hw.init();
	hw.bindActions();
});
