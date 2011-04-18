hw = (function() {
  var self = {
    places: null,
    providers: {},
	      
    init: function() {
      regexp = new RegExp(/app=([^&]+)/gi);
      app = regexp.exec(window.location.hash);
      
      if(app === null)
      {
        $('#overlay').show();
      }
      else
      {
        self.dataProvider = self.providers[app[1]]({});
        self.dataProvider.auth();
        self.dataProvider.fetchFriends();
      }
    },
    
    updateProvider: function(provider) {
      $('#overlay').hide();
      window.location.hash = '#!/app=' + provider;
      self.init();
    },

    bindActions: function() {
      $('#search_query').keypress(function(e) {
        if (e.which==13) {
          $('#categories li a').removeClass('active');
          e.preventDefault();
          self.dataProvider.search($(this).val());
        }
      });
    
      $('#friend_address').keypress(function(e) {
        if (e.which==13) {
          var $this = $(this);
          e.preventDefault();
          if($this.val() === '')
            if(!confirm('Just add new point?'))
              return;

          hw_map.geocodeFriend($this.val());
          $this.val('');
        }
      });

      $('#categories li.link a').click(function() {
        $('#categories li a').removeClass('active');
        self.dataProvider.search(this.innerText, true);
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
  };
  return self;
})();

jQuery(function($) {
  hw.init();
  hw.bindActions();
});
