(function(angular) {

  'use strict';

  angular.module('appControllers').controller('mapCtrl', ['$scope', 'mapService', 'jobsService', 'jobsMapConfig',
  	function ($scope, mapService, jobsService, jobsMapConfig){

  	// Map settings
    $scope.map = mapService.map;

    // Job Markers
    $scope.jobs = jobsService.jobs;
    $scope.jobMarkersConfig = jobsMapConfig.jobMarkersConfig;
            
    // Job Info Window
    $scope.jobWindow = jobsMapConfig.jobWindow;

    $scope.map.events.zoom_changed = function (map) {
      $scope.jobWindow.show = false;
      $scope.jobMarkersConfig.type = (map.getZoom() >= 13) ?  'spider' : 'cluster'; 
    };


  }]);

})(window.angular);