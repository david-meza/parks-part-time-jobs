(function(angular) {

  'use strict';

  angular.module('appControllers').controller('jobsListSmCtrl', ['$scope', '$mdDialog', '$mdSidenav', 'jobsFilterService', 'parkService', 'mapService', 'jobsService',
    function ($scope, $mdDialog, $mdSidenav, jobsFilterService, parkService, mapService, jobsService) {

      $scope.map = mapService.map;
      $scope.currentPlace = parkService.currentPlace;
          
      $scope.jobs = jobsService.jobs.list;

      $scope.parks = parkService.markers;
      // $scope.$watch('parks.content.length', function () {
      //   if ($scope.parks.content.length <= 0) { return; }
        
      //   $scope.jobs.splice(0, $scope.jobs.length);

      //   $scope.parks.content.forEach( function (park) {
      //     $scope.jobs = $scope.jobs.concat(park.jobs);
      //   });
      // });

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

      $scope.selectedFilters = jobsFilterService.filters;


  }]);

})(window.angular);