(function(angular) {

  'use strict';

  angular.module('appFilters').filter('applySelectedFilters', ['jobsFilterService', function(jobsFilterService) {
    
    var filtered = [];
    var selectedFilters = jobsFilterService.filters;
    console.log(selectedFilters);
    
    return function(jobs) {

      if (selectedFilters.categories.length <= 0 && selectedFilters.salary === 0 && selectedFilters.distance === 9999) { return jobs; }

      filtered.splice(0, filtered.length);

    	angular.forEach(jobs, function (job) {
        if (  job.minSalary >= Number(selectedFilters.salary) && 
              (!job.distance || job.distance <= Number(selectedFilters.distance) ) && 
              (selectedFilters.categories.length <= 0 || selectedFilters.categories.indexOf(job.department) > -1) ) {

          this.push(job);
        }
     
      }, filtered);

      selectedFilters.totalJobs = filtered.length;
      return filtered;
    };

  }]);

})(window.angular);
