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
      control: {} 
    };

    var parkWindow = {
      show: false,
      coords: {},
      control: {},
      options: {
        pixelOffset: { width: 0, height: -48 }
      },
      closeclick: function (windowScope) { console.log(windowScope);windowScope.show = false;currentPlace.name = 'Raleigh, NC' },
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

      console.log(markers.content);
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
            
            icon: 'https://s3.amazonaws.com/davidmeza/Park_Locator/tree-small.png',
            latitude: park.geometry.y,
            longitude: park.geometry.x,

            jobs: [
              { title: 'Camp Counselor- North/Northwest Raleigh (District 1)', salary: (8 + Math.random() * 12), description: 'Responsible for the direct supervision of campers, programming age appropriate activities and working with other staff to address the daily needs of a group of children during the summer season.', time: 'Part Time', category: 'Parks and Recreation', location: p.NAME, url: 'https://www.governmentjobs.com/careers/raleighnc/jobs/1314835/camp-counselor-southeast-raleigh-district-4', date: new Date(), distance: (Math.random() * 30), otherLocations: [] },
              { title: 'Cashier', salary: (8 + Math.random() * 12), description: 'Responsible for assisting full-time facility management and recreation leaders as a cashier at a waterfront facility and park.', time: 'Part Time', category: 'PRCR Resources', location: p.NAME, url: 'https://www.governmentjobs.com/careers/raleighnc/jobs/1119867/cashier-lake-johnson-park-and-lake-wheeler-park', date: new Date(), distance: (Math.random() * 30), otherLocations: [] }
            ],

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
      updateParkMarkers: updateParkMarkers,
      parkWindow: parkWindow,
      currentPlace: currentPlace
  	};

  }]);

})(window.angular);
