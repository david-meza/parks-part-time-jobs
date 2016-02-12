(function(angular) {

  'use strict';

  angular.module('appFilters').filter('applySelectedFilters', ['jobsFilterService', 'mapService', '$timeout',
    function(jobsFilterService, mapService, $timeout) {
    
    var selectedFilters = jobsFilterService.filters;

    // Helper to find at least one element of an array in another array
    var matchOneElement = function (arr1, arr2) {
      return arr2.some(function(arr2Val) {
        return arr1.indexOf(arr2Val) >= 0;
      });
    };

    var meetFilterCriteria = function (job) {
      return job.minSalary >= Number(selectedFilters.salary) && 
             ( !job.distance || job.distance <= Number(selectedFilters.distance) ) && 
             ( selectedFilters.categories.length === 0 || matchOneElement(job.categories, selectedFilters.categories) );
    };

    // Calculate distance from marker to user
    var userLoc = mapService.map.myLocationMarker.coords;
    
    var calculateDistance = function (job) {
      if (!job.latitude || !job.longitude) { return; }
      var xdist = Math.abs(userLoc.longitude - job.longitude);
      var ydist = Math.abs(userLoc.latitude - job.latitude);
      job.distance = Math.sqrt( Math.pow(xdist, 2) + Math.pow(ydist, 2) ) * 80;
    };

    var filtered = [];

    var currentReq;
    
    return function (jobs) {

      console.log('running the filter...');

      if (currentReq) { return filtered; }

      var promise = $timeout( function () {
        // Empty filtered array
        filtered.splice(0, filtered.length);
        // Add jobs that meet the filtering criteria
      	angular.forEach(jobs, function (job) {
          calculateDistance(job); 
          if ( meetFilterCriteria(job) ) { this.push(job); }
        }, filtered);
        // Keep track of the total amount of jobs
        selectedFilters.totalJobs = filtered.length;
        return filtered;
      }, 2000);

      currentReq = promise;
      
      promise.then( function(r) {
        console.log('completed timeout', r);
        $timeout.cancel(currentReq);
        currentReq = undefined;
      });
      
      return filtered;
    };

  }]);

})(window.angular);
