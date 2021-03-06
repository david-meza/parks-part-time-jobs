(function(angular) {

  'use strict';

  angular.module('appControllers').controller('mapActionsCtrl', ['$scope', 'mapService', '$mdDialog',
    function ($scope, mapService, $mdDialog) {
          
      // Reference to service geo-location
      $scope.geoLocate = mapService.geoLocate;

      // Opens the dialog showing address edit input field
      $scope.editLocation = function (ev) {
        $mdDialog.show({
          templateUrl: 'views/partials/edit-location-dialog.html',
          targetEvent: ev,
          fullscreen: true,
          clickOutsideToClose:true,
          controller: 'DialogCtrl',
          bindToController: true
        });
      };

      $scope.speedDial = {
        hidden: false,
        isOpen: false,
        openDirection: 'up',
        items: [
          { tooltipVisible: false, name: 'Edit Location', direction: 'left', icon: 'core2:person-pin', action: $scope.editLocation, addIconClass: 'person-pin' },
          { tooltipVisible: false, name: 'Find Me!', direction: 'left', icon: 'core2:my-location', action: $scope.geoLocate, addIconClass: 'my-location' },
          // { tooltipVisible: false, name: 'Search Job', direction: 'left', icon: 'core:search', action: $scope.geoLocate }
        ]
      };

  }]);

})(window.angular);