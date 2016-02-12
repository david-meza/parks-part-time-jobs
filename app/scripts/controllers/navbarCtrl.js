(function(angular) {

  'use strict';

  angular.module('appControllers').controller('navbarCtrl', ['$scope', '$rootScope', 'deviceService', '$mdSidenav', 'jobsFilterService', '$timeout', '$interval',
  	function ($scope, $rootScope, deviceService, $mdSidenav, jobsFilterService, $timeout, $interval) {
      
      $scope.title = "Map My Park Job";
      
      // Start the circular progress icon
      $scope.progress = 'indeterminate';

      $scope.searchProgress = 0;

      $scope.activeTab = deviceService.activeTab;
      $scope.isMobile = deviceService.isMobile;

      $scope.filters = {
        searchText: undefined
      };

      var searchPromise;

      var progressInterval = $interval( function () {
        $scope.searchProgress += 15;
      }, 100, 0, true);

      $scope.$watch('filters.searchText', function (newVal) {
        // Debounce updating the searchText model in the service
        $timeout.cancel(searchPromise);
        $scope.searchProgress = 0;

        searchPromise = $timeout( function () {
          jobsFilterService.filters.searchText = newVal; 
          // $interval.cancel(progressInterval);
          $scope.searchProgress = 100;
        }, 1000);
      });



      $scope.toggleSidenav = function () {
        $mdSidenav('left').toggle();
      };

      $rootScope.$on('loading:progress', function(){
        $scope.progress = 'indeterminate';
      });

      $rootScope.$on('loading:finish', function(){
      	$scope.progress = undefined;
      });

      $scope.$on('$destroy', function() {
        // Make sure that the interval is destroyed too
        if (angular.isDefined(stop)) {
          $interval.cancel(progressInterval);
          progressInterval = undefined;
        }
      });

  }]);

})(window.angular);