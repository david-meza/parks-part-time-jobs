(function(angular) {

  'use strict';

  angular.module('appControllers').controller('navbarCtrl', ['$scope', '$rootScope', 'deviceService', '$mdSidenav', 'jobsFilterService', '$timeout',
  	function ($scope, $rootScope, deviceService, $mdSidenav, jobsFilterService, $timeout) {
      
      $scope.title = "Map My Park Job";
      
      // Start the circular progress icon
      $scope.progress = 'indeterminate';

      $scope.activeTab = deviceService.activeTab;
      $scope.isMobile = deviceService.isMobile;

      $scope.filters = {
        searchText: undefined
      };

      var searchPromise;

      $scope.$watch('filters.searchText', function (newVal) {
        // Debounce updating the searchText model in the service
        $timeout.cancel(searchPromise);
        searchPromise = $timeout( function () {
          jobsFilterService.filters.searchText = newVal; 
        }, 500);
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

  }]);

})(window.angular);