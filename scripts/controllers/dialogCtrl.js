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


      $scope.settings = [
        { name: 'Wi-Fi', extraScreen: 'Wi-fi menu', icon: 'device:network-wifi', enabled: true },
        { name: 'Bluetooth', extraScreen: 'Bluetooth menu', icon: 'device:bluetooth', enabled: false },
      ];



    }]);

})(window.angular);
