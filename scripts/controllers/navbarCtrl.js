(function(angular) {

  'use strict';

  angular.module('appControllers').controller('navbarCtrl', ['$scope', '$rootScope', 'parkService', 'deviceService', '$mdSidenav',
  	function ($scope, $rootScope, parkService, deviceService, $mdSidenav) {
      
      var markers = parkService.markers;
      
      $scope.title = "Map My Park Job";
      
      // Start the circular progress icon
      $scope.progress = 'indeterminate';

      $scope.activeTab = deviceService.activeTab;
      $scope.isMobile = deviceService.isMobile;


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