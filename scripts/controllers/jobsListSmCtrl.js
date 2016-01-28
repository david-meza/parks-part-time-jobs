(function(angular) {

  'use strict';

  angular.module('appControllers').controller('jobsListSmCtrl', ['$scope', '$mdDialog', '$mdSidenav', 'parkService', 'mapService', 'jobsService',
    function ($scope, $mdDialog, $mdSidenav, parkService, mapService, jobsService) {

      $scope.map = mapService.map;
      $scope.currentPlace = parkService.currentPlace;
          
      $scope.jobs = jobsService.jobs.list;

      $scope.parks = parkService.markers;

      $scope.centerToPark = function (park) {
        $scope.map.location.coords.latitude = park.latitude;
        $scope.map.location.coords.longitude = park.longitude;
        park.markerClick();
      };

      $scope.sortOptions = [
        { view: 'nearest', model: 'distance' },
        { view: 'furthest', model: '-distance' },
        { view: 'oldest', model: 'createdDate' }, 
        { view: 'newest', model: '-createdDate' }, 
        { view: 'salary ($ - $$$)', model: 'minSalary' }, 
        { view: 'salary ($$$ - $)', model: '-minSalary' }, 
        { view: 'job title (A-Z)', model: 'title' },
        { view: 'job title (Z-A)', model: '-title' }
      ];

      $scope.selectedSort = 'distance';

      $scope.openFilterSelection = function () {
        $mdSidenav('filter').toggle();
      };


  }]);

})(window.angular);