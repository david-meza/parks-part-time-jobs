'use strict';

angular.module('parkLocator').controller('navbarCtrl', ['$scope', '$rootScope', 'parkService', 'deviceService',
	function ($scope, $rootScope, parkService, deviceService) {
    
    var markers = parkService.markers;
    
    $scope.title = "Raleigh Park Locator";
    
    // Start the circular progress icon
    $scope.progress = 'indeterminate';

    $scope.activeTab = deviceService.activeTab;
    $scope.isMobile = deviceService.isMobile;

    $scope.selectPark = function () {
      $scope.activeTab.name = 'park';
    };

    $rootScope.$on('loading:progress', function(){
      $scope.progress = 'indeterminate';
    });

    $rootScope.$on('loading:finish', function(){
    	$scope.progress = undefined;
      // informUser();
    });

}]);