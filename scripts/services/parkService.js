(function(angular) {

  'use strict';

  angular.module('appServices').factory('parkService', ['$http', '$state', 'uiGmapGoogleMapApi',
  	function ($http, $state, gMapsApi) {
  	
    var mapsApi;

  	gMapsApi.then( function (maps) {
      mapsApi = maps;
    });

    var currentPlace = { name: 'Raleigh, NC' };
  	
    var markers = { 
      content: [], 
      currentPark: undefined, 
      rebuild: false, 
      shallowWatch: false, 
      fitToMap: false,
      markerEvents: {},
      control: {} 
    };

    var parkMarkersConfig = {
      type: 'cluster',
      typeOptions: {
        title: 'Zoom in to find more parks!',
        gridSize: 60,
        minimumClusterSize: 3
      },
      typeEvents: {}
    };

    parkMarkersConfig.typeOptions.styles = [{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: 'img/icons/park-marker-cluster.svg',height: 40,width: 40},{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: 'img/icons/park-marker-cluster.svg',height: 44,width: 44},{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: 'img/icons/park-marker-cluster.svg',height: 48,width: 48},{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: 'img/icons/park-marker-cluster.svg',height: 52,width: 52},{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: 'img/icons/park-marker-cluster.svg',height: 56,width: 56}];

    var parkWindow = {
      show: false,
      coords: {},
      control: {},
      options: {
        pixelOffset: { width: 0, height: -48 }
      },
      closeclick: function (windowScope) { windowScope.show = false; currentPlace.name = 'Raleigh, NC' },
      templateUrl: 'views/partials/park-window.html',
      templateParameter: {},
    };


    var _positionParkWindow = function(parkModel) {
      parkWindow.coords.latitude = parkModel.latitude;
      parkWindow.coords.longitude = parkModel.longitude;
      parkWindow.templateParameter.name = parkModel.name;
      parkWindow.templateParameter.address = parkModel.address;
      parkWindow.templateParameter.phone = parkModel.phone;
      parkWindow.templateParameter.jobs = parkModel.jobs.length;
      parkWindow.show = true;
    };
  	
    var _markerClick = function (gInstance, evnt, model) {
      markers.currentPark = model;
      currentPlace.name = model.name;
      
      // Place the info window above park marker and pass in the park info
      _positionParkWindow(model);
      
      // Trigger a state change and show the park details
      // $state.go('home.park', { 'name': markers.currentPark.name.replace(/\W+/g, '').toLowerCase() });
    };

    var generateOtherLocations = function () {
      angular.forEach(markers.content, function (park, idx) {

        angular.forEach(park.jobs, function (job) {

          var numOfParksToAdd = Math.floor(Math.random() * 5) + 1;
          var iterable = [];

          for (var i = 0; i < numOfParksToAdd; i++) {
            iterable.push( Math.floor(Math.random() * markers.content.length) );  
          };
          
          angular.forEach(iterable, function (randIndex) {
            if (randIndex === idx) return;
            var relatedPark = markers.content[randIndex];
            // Only get the properties that we need to avoid infinite recursion from park jobs linking to other parks
            job.otherLocations.push({ 
              name: relatedPark.name, 
              markerClick: function () { 
                relatedPark.markerClick.call(relatedPark, null, 'click', relatedPark);
              },
              latitude: relatedPark.latitude,
              longitude: relatedPark.longitude
            });
          });
          
        });
        
        
      });
    };


    var _generateMarkers = function (response) {

      if (typeof response.data === 'object') {

        // Empty the existing parks array before adding the new results
        if (markers.content.length > 0) {
          markers.content.splice(0, markers.content.length);
        }

        response.data.features.forEach(function(park){
          var p = park.attributes;
          var marker = {
            id: p.OBJECTID,
            name: p.NAME,
            address: p.ADDRESS,
            url: p.URL,
            phone: p.PHONE,
            alias1: p.ALIAS1,
            alias2: p.ALIAS2,
            scale: p.SCALE,
            
            icon: 'img/icons/park-marker.svg',
            latitude: park.geometry.y,
            longitude: park.geometry.x,

            jobs: [],

            markerClick: _markerClick,
            options: {
              title: p.NAME,
              labelAnchor: '0 0',
              animation: (mapsApi ? mapsApi.Animation.DROP : 2)
            },
          };

          // Storing parks both individually as key on markers object and as an array of parks
          var parkName = p.NAME.replace(/\W+/g, '').toLowerCase();
          if (!markers[parkName]) { markers[parkName] = marker; }

          markers.content.push(marker);
        });

        generateOtherLocations();
        
      } else {
        console.log('error', response);
      }
  	};

  	var _logAjaxError = function (error) {
  		console.log(error);
  	};

    var updateParkMarkers = function (selectedActivities) {
      var query = '';
      if (!selectedActivities) { return; }

      selectedActivities.forEach( function (activity, idx) {
        query += activity.parkAttr + '%3D' + '%27Yes%27';
        if (idx <= selectedActivities.length - 2) { query += '+AND+'; }
        
      });
      getParksInfo(query);
    };

    var getParksInfo = function (where) {
      var url = 'https://maps.raleighnc.gov/arcgis/rest/services/Parks/ParkLocator/MapServer/0/query?where=' + (where ? where : 'COMMUNITYCENTER%3D%27Yes%27') + '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=OBJECTID&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson';
    	$http({
    		method: 'GET',
    		url: url
    	}).then(_generateMarkers, _logAjaxError);
    };

    // This gets automatically called because of the $watchCollection in MapCtrl
    getParksInfo();


  	return {
  		markers: markers,
      parkMarkersConfig: parkMarkersConfig,
      updateParkMarkers: updateParkMarkers,
      parkWindow: parkWindow,
      currentPlace: currentPlace
  	};

  }]);

})(window.angular);
