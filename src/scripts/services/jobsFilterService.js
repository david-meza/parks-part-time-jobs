(function(angular) {

  'use strict';

  angular.module('appServices').factory('jobsFilterService',
    function () {

    var filters = {
      salary: 0, // $0 or more
      distance: 9999, // 9999 miles
      categories: [],
      totalJobs: undefined
    };

    return {
      filters: filters
    };

  });

})(window.angular);
