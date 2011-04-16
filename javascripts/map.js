jQuery(function($) {
    var map = new google.maps.Map($('#map_canvas')[0], {
      zoom: 17,
      center: new google.maps.LatLng(52.219505, 21.012436),
      mapTypeId: google.maps.MapTypeId.ROADMAP
    });
});
