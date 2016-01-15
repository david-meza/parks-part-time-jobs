(function(angular) {

  'use strict';

  angular.module('appFilters').filter('applySelectedFilters', function() {
    
    var filtered = [];
    
    return function(jobs, selectedFilters) {

      if (selectedFilters.categories.length <= 0 && selectedFilters.salary === 0 && selectedFilters.distance === 9999) { return jobs; }

      filtered.splice(0, filtered.length);

    	angular.forEach(jobs, function (job) {
        if (  job.salary >= selectedFilters.salary && 
              job.distance <= selectedFilters.distance && 
              (selectedFilters.categories.length <= 0 || selectedFilters.categories.indexOf(job.category) > -1) )
     
          this.push(job);

        
      }, filtered);

      return filtered;
    };

  });

})(window.angular);
