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
      var progressInterval;

      var startSearch = function () {
        if (!angular.isDefined(progressInterval)) {
          progressInterval = $interval( function () {
            $scope.searchProgress += 15;
          }, 100, 0, true);
        }
      };

      var stopSearch = function () {
        if (angular.isDefined(progressInterval)) {
          $interval.cancel(progressInterval);
          progressInterval = undefined;
        }
      };

      $scope.$watch('filters.searchText', function (newVal) {
        // Debounce updating the searchText model in the service
        $timeout.cancel(searchPromise);
        $scope.searchProgress = 0;
        startSearch();

        searchPromise = $timeout( function () {
          jobsFilterService.filters.searchText = newVal; 
          stopSearch;
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
        stopSearch
      });

  }]);

})(window.angular);