hw_map = (function() {
    var self = {
        myMarker: null,
        myAccuracy: null,
        map: null,
        accuracyColor: '#ff9000',
        pois: [],

        createMap: function() {
            self.map = new google.maps.Map($('#map_canvas')[0], {
                zoom: 17,
                center: new google.maps.LatLng(52.219505, 21.012436),
                mapTypeId: google.maps.MapTypeId.ROADMAP
            });
        },

        updateMyMarker: function(latitude, longitude, accuracy) {
            var pos = new google.maps.LatLng(latitude, longitude);            
            if (!self.myMarker) {
                self.myMarker = new google.maps.Marker({
                    map: self.map,
                });
            }
            self.myMarker.setPosition(pos);
            if (typeof accuracy != 'undefined' && accuracy) {
                if (!self.myAccuracy) {
                    self.myAccuracy = new google.maps.Circle({
                        map: self.map,
                        clickable: false,
                        fillColor: self.accuracyColor,
                        fillOpacity: 0.1,
                        strokeColor: self.accuracyColor,
                        strokeOpacity: 0.2,
                        strokeWeight: 1,
                    });
                }
                self.myAccuracy.setCenter(pos);
                self.myAccuracy.setRadius(accuracy);
            }
            self.map.setCenter(pos);
        },
    };
    return self;
})();

$(function() {
    hw_map.createMap();
});
