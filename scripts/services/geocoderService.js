(function(angular) {

  'use strict';

  angular.module('appServices').factory('geocoderService', ['$q', '$timeout', 'uiGmapGoogleMapApi',
    function ($q, $timeout, mapsApi) {
    

    var locations = {};
    var queue = [];
    var geocoder;
    
    // Assign the google.maps object when the API is ready
    var google = {};
    mapsApi.then( function (maps) {
      google.maps = maps;
      geocoder = new google.maps.Geocoder();
      geocodeNextAddress();
    });

    // Amount of time (in milliseconds) to pause between each trip to the
    // Geocoding API, which places limits on frequency.
    var QUERYPAUSE = 250;

    /**
     * geocodeNextAddress() - execute the next function in the queue.
     *                  If a result is returned, fulfill the promise.
     *                  If we get an error, reject the promise (with message).
     *                  If we receive OVER_QUERY_LIMIT, increase interval and try again.
     */
    var geocodeNextAddress = function () {
      // Don't do anything if there aren't any tasks left
      if (!queue.length) { return; }

      // Get the next task (though not shift from queue yet, until it is finally resolved)
      var task = queue[0];

      // If we already processed this address return the stored results and go on to the next item in the queue
      if (locations.hasOwnProperty(task.address)) {
        queue.shift();
        task.d.resolve(locations[task.address]);
        if (queue.length) { return geocodeNextAddress(); }

      // Otherwise get the results from the geocoder service
      } else {
        geocoder.geocode({ address : task.address }, function (result, status) {

          // Resolve the promise with the results and reset the pause to the default
          if (status === google.maps.GeocoderStatus.OK) {

            var parsedResult = {
              lat: result[0].geometry.location.lat(),
              lng: result[0].geometry.location.lng(),
              formattedAddress: result[0].formatted_address
            };
            
            locations[task.address] = parsedResult;
            task.d.resolve(parsedResult);
            QUERYPAUSE = 250;

          // Increase the pause up to 1s intervals and keep trying...
          } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
            QUERYPAUSE < 1000 ? QUERYPAUSE += 250 : QUERYPAUSE = 1000;

          // Reject any other result
          } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
            task.d.reject({
              type: 'zero',
              message: 'Zero results for geocoding address ' + task.address
            });
          } else if (status === google.maps.GeocoderStatus.REQUEST_DENIED) {
            task.d.reject({
              type: 'denied',
              message: 'Request denied for geocoding address ' + task.address
            });
          } else {
            task.d.reject({
              type: 'invalid',
              message: 'Invalid request for geocoding: status=' + status + ', address=' + task.address
            });
          }

          // Remove from queue if the promise has been resolved or rejected
          if (status !== google.maps.GeocoderStatus.OVER_QUERY_LIMIT) { queue.shift(); }

          // Go on to the next item in the queue
          if (queue.length) { $timeout(geocodeNextAddress, QUERYPAUSE); }    
        });
      }


    };

    // Publically available function to push addresses to the queue. Returns the promise so it can be chained with .then
    var getLatLng = function (address) {
      var d = $q.defer();

      queue.push({
        address: address,
        d: d
      });

      if (queue.length === 1) { geocodeNextAddress(); }

      return d.promise;
    };

    
    return {
      getLatLng : getLatLng
    };


  }]);

})(window.angular);
