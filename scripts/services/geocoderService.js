(function(angular) {

  'use strict';

  angular.module('appServices').factory('geocoderService', ['$q', '$timeout', '$rootScope', 'uiGmapGoogleMapApi',
    function ($q, $timeout, $rootScope, mapsApi) {
    

    var locations = {};
    var queue = [];
    
    // Assign the maps object when the api is ready
    var google = {};
    mapsApi.then( function (maps) {
      google.maps = maps;
    });

    // Amount of time (in milliseconds) to pause between each trip to the
    // Geocoding API, which places limits on frequency.
    var QUERYPAUSE = 250;

    /**
     * executeNext() - execute the next function in the queue.
     *                  If a result is returned, fulfill the promise.
     *                  If we get an error, reject the promise (with message).
     *                  If we receive OVER_QUERY_LIMIT, increase interval and try again.
     */
    var executeNext = function () {
      var task = queue.shift(),
          geocoder = new google.maps.Geocoder();

      geocoder.geocode({ address : task.address }, function (result, status) {

        if (status === google.maps.GeocoderStatus.OK) {

          var parsedResult = {
            lat: result[0].geometry.location.lat(),
            lng: result[0].geometry.location.lng(),
            formattedAddress: result[0].formatted_address
          };
          
          locations[task.address] = parsedResult;
          task.d.resolve(parsedResult);
          QUERYPAUSE = 250;

        } else if (status === google.maps.GeocoderStatus.ZERO_RESULTS) {
          task.d.reject({
            type: 'zero',
            message: 'Zero results for geocoding address ' + task.address
          });
        } else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
          queue.unshift(task);
          QUERYPAUSE < 1000 ? QUERYPAUSE += 250 : QUERYPAUSE = 1000;
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

        // if (!$rootScope.$$phase) { $rootScope.$apply(); }
      });

      if (queue.length) {
        $timeout(executeNext, QUERYPAUSE);
      }    

    };

    var geocodeAddress = function (address) {
      var d = $q.defer();

      if (locations.hasOwnProperty(address)) {
        d.resolve(locations[address]);
      } else {
        queue.push({
          address: address,
          d: d
        });

        if (queue.length === 1) {
          executeNext();
        }
      }

      return d.promise;
    };

    
    return {
      geocodeAddress : geocodeAddress
    };


  }]);

})(window.angular);
