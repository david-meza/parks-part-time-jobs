(function(angular) {

  'use strict';

  angular.module('appFilters').filter('filterByPark', ['parkService', function(parkService) {
    
    var filtered = [];

    return function(jobs) {

      var loc = parkService.currentPlace.name

      if (loc === 'Raleigh, NC') { return jobs; }

      filtered.splice(0, filtered.length);

    	angular.forEach(jobs, function (job) {
        if (job.location === loc) { this.push(job); }
      }, filtered);

      return filtered;
    };
  }]);

})(window.angular);
