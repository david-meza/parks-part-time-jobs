(function(angular) {

  'use strict';

  angular.module('appControllers').controller('jobsListSmCtrl', ['$scope', '$mdDialog', '$mdSidenav', 'mapService', 'jobsService', '$timeout', 'jobsFilterService', '$mdToast',
    function ($scope, $mdDialog, $mdSidenav, mapService, jobsService, $timeout, jobsFilterService, $mdToast) {

      $scope.map = mapService.map;

      $scope.currentPlace = { name: 'Raleigh, NC' };

      $scope.jobs = jobsService.jobs;

      $scope.selectedFilters = jobsFilterService.filters;
      $scope.sortOptions = jobsFilterService.sortOptions;

      var showNoLocation = function() {
        $mdToast.show( $mdToast.simple()
          .textContent('Oops! This job does not have a set location.')
          .position('top right')
          .hideDelay(3000) );
      };

      $scope.centerToJob = function (job) {
        if (!job.latitude) { return showNoLocation(); }
        $scope.map.zoom = 13;
        $scope.map.location.coords.latitude = job.latitude;
        $scope.map.location.coords.longitude = job.longitude;
        $timeout( function () {
          job.markerClick(null, 'card click', job);
        }, 200);
      };

      $scope.openFilterSelection = function () {
        $mdSidenav('filter').toggle();
      };


  }]);

})(window.angular);