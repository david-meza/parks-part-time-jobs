(function(angular) {

  'use strict';

  angular.module('appFilters').filter('applySelectedFilters', ['jobsFilterService', function(jobsFilterService) {
    
    // We declare the filtered array outside the filtering function so we don't create a new array 
    // and trigger a digest loop with every filter function call (inf digest loop)
    var filtered = [];
    var selectedFilters = jobsFilterService.filters;
    
    return function(jobs) {

      // All filters are clear
      if (selectedFilters.categories.length <= 0 && selectedFilters.salary === 0 && selectedFilters.distance === 9999) { 
        selectedFilters.totalJobs = jobs.length; 
        return jobs; 
      }

      // Empty the filtered array before we do anything
      filtered.splice(0, filtered.length);

      // Add jobs that meet the filtering criteria
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
