(function(angular) {

  'use strict';

  angular.module('appServices').factory('jobsFilterService',
    function () {

    var filters = {
      salary: 0, // $0 or more
      distance: 9999, // any distance (miles)
      categories: [],
      totalJobs: undefined,
      searchText: undefined,
      selectedSort: '-minSalary'
    };

    var sortOptions = [
      { view: 'nearest', model: 'distance' },
      { view: 'furthest', model: '-distance' },
      { view: 'oldest', model: 'createdDate' }, 
      { view: 'newest', model: '-createdDate' }, 
      { view: 'expiring soon', model: 'endDate' }, 
      { view: 'salary ($ - $$$)', model: 'minSalary' }, 
      { view: 'salary ($$$ - $)', model: '-minSalary' }, 
      { view: 'job title (A-Z)', model: 'title' },
      { view: 'job title (Z-A)', model: '-title' }
    ];

    return {
      filters: filters,
      sortOptions: sortOptions
    };

  });

})(window.angular);
