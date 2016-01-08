(function(angular) {

  'use strict';

  angular.module('appControllers').controller('DialogCtrl', ['$scope', '$mdDialog', 'amenitiesService',
    function DialogCtrl($scope, $mdDialog, amenitiesService) {
      $scope.activities = amenitiesService.list.uniques.concat(amenitiesService.selectedActivities.current);
      $scope.amenitiesService = amenitiesService.list;

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
