(function(angular) {

  'use strict';

  angular.module('appControllers').controller('tourCtrl', ['$scope', 'ipCookie', '$timeout',
    function ($scope, ipCookie, $timeout) {
      
      $timeout(function(){
        $scope.currentStep = ipCookie('guided-tour') || 0;
      }, 5000);

      $scope.stepComplete = function() {
        ipCookie('guided-tour', $scope.currentStep, { expires: 30 });
      };

    }
  ]);

})(window.angular);