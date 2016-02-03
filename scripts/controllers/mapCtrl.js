(function(angular) {

  'use strict';

  angular.module('appControllers').controller('mapCtrl', ['$scope', 'mapService', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$q', '$mdDialog', 'jobsService', 'jobsMapConfig',
  	function ($scope, mapService, gMapsAPI, uiGmapIsReady, $q, $mdDialog, jobsService, jobsMapConfig){

  	// Map settings
    $scope.map = mapService.map;
    
    // Job Markers
    $scope.jobs = jobsService.jobs;
    $scope.jobMarkersConfig = jobsMapConfig.jobMarkersConfig;
            
    // Job Info Window
    $scope.jobWindow = jobsMapConfig.jobWindow;


    $scope.map.events.zoom_changed = function (map) {
      $scope.jobWindow.show = false;
      $scope.jobMarkersConfig.type = (map.getZoom() >= 14) ?  'spider' : 'cluster'; 
    };

    var mapInstance,
        mapsApi;

    gMapsAPI.then( function (maps) {
    	mapsApi = maps;
    });

    uiGmapIsReady.promise(1).then(function(instances) {
      mapInstance = instances[0].map;
      // console.log( mapInstance.getMapTypeId() );
      // applyMapStyles();
    });

    var applyMapStyles = function () {
    	var styledMap = new mapsApi.StyledMapType( $scope.map.options.styles, {name: 'Nature'});
  	  mapInstance.setMapTypeId('nature');
      mapInstance.mapTypes.set('nature', styledMap);
      console.log( mapInstance.getMapTypeId() );
    };

  }]);

})(window.angular);