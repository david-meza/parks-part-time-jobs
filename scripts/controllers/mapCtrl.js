(function(angular) {

  'use strict';

  angular.module('appControllers').controller('mapCtrl', ['$scope', 'mapService', 'parkService', 'uiGmapGoogleMapApi', 'uiGmapIsReady', '$q', '$mdDialog', 'jobsService', 'jobsMapConfig',
  	function ($scope, mapService, parkService, gMapsAPI, uiGmapIsReady, $q, $mdDialog, jobsService, jobsMapConfig){

  	// Map settings
    $scope.map = mapService.map;

    // $scope.$watch('map.location.coords', function(newValue) {
      // console.log(newValue);
    // }, true);
    
    // Park Markers
    $scope.parks = parkService.markers;
    $scope.parkMarkersConfig = parkService.parkMarkersConfig;

    // Job Markers
    $scope.jobs = jobsService.jobs;
    $scope.jobMarkersConfig = jobsMapConfig.jobMarkersConfig;
            
    // Park Info Window
    $scope.parkWindow = parkService.parkWindow;

    // Job Info Window
    $scope.jobWindow = jobsMapConfig.jobWindow;

    // Make a new query when the activities filter changes
    // $scope.$watchCollection('selectedActivities.current', function (selected) {
    //   parkService.updateParkMarkers(selected);
    // });

    $scope.map.events.zoom_changed = function (map) {
      $scope.parkWindow.show = false;
      $scope.jobWindow.show = false;      
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