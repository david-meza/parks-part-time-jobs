(function(angular) {

  'use strict';

  angular.module('appControllers').controller('DialogCtrl', ['$scope', '$mdDialog',
    function DialogCtrl($scope, $mdDialog) {

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.answer = function(answer) {
        $mdDialog.hide(answer);
      };
    }]);

})(window.angular);
