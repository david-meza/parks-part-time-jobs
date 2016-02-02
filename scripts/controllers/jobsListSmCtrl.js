(function(angular) {

  'use strict';

  angular.module('appControllers').controller('jobsListSmCtrl', ['$scope', '$mdDialog', '$mdSidenav', 'mapService', 'jobsService',
    function ($scope, $mdDialog, $mdSidenav, mapService, jobsService) {

      $scope.map = mapService.map;

      $scope.currentPlace = 'Raleigh, NC';
          
      $scope.jobs = jobsService.jobs.list;

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