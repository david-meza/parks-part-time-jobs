(function(angular) {

  'use strict';

  angular.module('appControllers').controller('jobsListSmCtrl', ['$scope', '$mdDialog', '$mdSidenav', 'mapService', 'jobsService', '$timeout', 'jobsFilterService',
    function ($scope, $mdDialog, $mdSidenav, mapService, jobsService, $timeout, jobsFilterService) {

      $scope.map = mapService.map;

      $scope.currentPlace = { name: 'Raleigh, NC' };

      $scope.today = new Date().valueOf();

      $scope.jobs = jobsService.jobs;

      $scope.selectedFilters = jobsFilterService.filters;

      $scope.centerToJob = function (job) {
        $scope.map.zoom = 13;
        $scope.map.location.coords.latitude = job.latitude;
        $scope.map.location.coords.longitude = job.longitude;
        $timeout( function () {
          job.markerClick(null, 'card click', job);
        }, 200);
      };

      $scope.sortOptions = [
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

      $scope.selectedSort = '-minSalary';

      $scope.openFilterSelection = function () {
        $mdSidenav('filter').toggle();
      };


  }]);

})(window.angular);