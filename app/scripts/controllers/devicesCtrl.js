(function(angular) {

  'use strict';

  angular.module('appControllers').controller('devicesCtrl', ['$scope', 'deviceService',
  	function($scope, deviceService){

      $scope.isMobile = deviceService.isMobile;

      $scope.activeTab = deviceService.activeTab;

      $scope.showList = function () {
        return $scope.isMobile() && $scope.activeTab.list;
      };

  }]);

})(window.angular);
