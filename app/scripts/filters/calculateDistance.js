(function(angular) {

  'use strict';

  angular.module('appFilters').filter('calculateDistanceToUser', ['mapService', function(mapService) {

    var userLoc = mapService.map.myLocationMarker.coords;
    
    var calculateDistance = function (job) {
      if (!job.latitude || !job.longitude) { return; }
      var xdist = Math.abs(userLoc.longitude - job.longitude);
      var ydist = Math.abs(userLoc.latitude - job.latitude);
      job.distance = Math.sqrt( Math.pow(xdist, 2) + Math.pow(ydist, 2) ) * 80;
    };

    return function(jobs) {

      angular.forEach(jobs, calculateDistance);

      return jobs;
    };
  }]);

})(window.angular);
