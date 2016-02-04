(function(angular) {

  'use strict';

  angular.module('appControllers').controller('tourCtrl', ['$scope', 'ipCookie', '$timeout', 'deviceService',
    function ($scope, ipCookie, $timeout, deviceService) {
      
      $timeout(function(){
        $scope.currentStep = deviceService.isMobile() ? 5 : ipCookie('guided-tour') || 0;
      }, 10000);

      $scope.stepComplete = function() {
        ipCookie('guided-tour', $scope.currentStep, { expires: 30 });
      };

    }
  ]);

})(window.angular);