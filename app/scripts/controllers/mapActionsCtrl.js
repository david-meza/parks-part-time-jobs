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
          { tooltipVisible: false, name: "Edit Location", direction: "left", icon: "img/icons/person-pin.svg", action: $scope.editLocation, addIconClass: 'person-pin' },
          { tooltipVisible: false, name: "Find Me!", direction: "left", icon: "img/icons/my-location.svg", action: $scope.geoLocate, addIconClass: 'my-location' },
          // { tooltipVisible: false, name: "Search Job", direction: "left", icon: "img/icons/search-color.svg", action: $scope.geoLocate },
          // { tooltipVisible: false, name: "Toggle Park Grouping", direction: "left", icon: "img/icons/marker-off.svg", action: $scope.toggleParkGrouping }
        ]
      };

  }]);

})(window.angular);