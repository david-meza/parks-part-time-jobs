(function(angular) {

  'use strict';

  angular.module('appControllers').controller('navbarCtrl', ['$scope', '$rootScope', 'deviceService', '$mdSidenav', 'jobsFilterService',
  	function ($scope, $rootScope, deviceService, $mdSidenav, jobsFilterService) {
      
      $scope.title = "Map My Park Job";
      
      // Start the circular progress icon
      $scope.progress = 'indeterminate';

      $scope.activeTab = deviceService.activeTab;
      $scope.isMobile = deviceService.isMobile;

      $scope.filters = jobsFilterService.filters;


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