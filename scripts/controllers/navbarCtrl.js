'use strict';

angular.module('parkLocator').controller('navbarCtrl', ['$scope', '$rootScope', 'parkService', 'deviceService', '$mdSidenav',
	function ($scope, $rootScope, parkService, deviceService, $mdSidenav) {
    
    var markers = parkService.markers;
    
    $scope.title = "Part Time Park Jobs";
    
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