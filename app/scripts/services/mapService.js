(function(angular) {

  'use strict';

  angular.module('appServices').factory('mapService', ['uiGmapGoogleMapApi', '$mdToast',
    function (gMapsApi, $mdToast) {


    var mapsObj;

    // Temporary coordinates while Geoloc gets us the user's coords
    var location = {
    	coords: {
  	    latitude: 35.79741992502266, 
  	    longitude: -78.64118938203126
    	}
    };

    var map = {
    	// 1 to 20 - 20 being closely zoomed in
      zoom: 13,
      // turns to true when the map is being dragged
      dragging: false,
      // set to true to trigger a map refresh when necessary
      refresh: false,
      pan: false,
      location: location,
      control: {},
      events: {},
      bounds: {
        northeast: {
          longitude: -78.336890,
          latitude: 36.113561
        },
        southwest: {
          latitude: 35.437814,
          longitude: -78.984583
        }
      },
      options: {
        disableDefaultUI: true,
        draggable: true,
        scrollwheel: false,
        minZoom: 9,
        tilt: 0,
        zoomControl: true,
        zoomControlOptions: {
          position: mapsObj ? mapsObj.ControlPosition.LEFT_BOTTOM : 6,
          style: mapsObj ? mapsObj.ZoomControlStyle.SMALL : 1,
        },
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: true,
        streetViewControlOptions: {
          position: mapsObj ? mapsObj.ControlPosition.LEFT_BOTTOM : 6
        },
        rotateControl: false,
        panControl: false
      },
    };

    // Map Theme: Pale Dawn
    map.options.styles = [{'featureType':'administrative','elementType':'all','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'landscape','elementType':'all','stylers':[{'color':'#f2e5d4'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#c5dac6'}]},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{'featureType':'road','elementType':'all','stylers':[{'lightness':20}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#c5c6c6'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#e4d7c6'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#fbfaf7'}]},{'featureType':'water','elementType':'all','stylers':[{'visibility':'on'},{'color':'#acbcc9'}]}];

    // Marker for current location (Geolocation or default)
    map.myLocationMarker = {
      id: 0,
      coords: { latitude: location.coords.latitude, longitude: location.coords.longitude },
      options: {
        draggable: true,
        clickable: false,
        icon: 'https://s3.amazonaws.com/davidmeza/Park_Locator/user.png',
        animation: (mapsObj ? mapsObj.Animation.DROP : 2)
      },
    };

    var updateUserCoords = function (lat, lon) {
      // Update the location obj with the accurate user coords
      map.location.coords.latitude = lat;
      map.location.coords.longitude = lon;
      map.myLocationMarker.coords.latitude = lat;
      map.myLocationMarker.coords.longitude = lon;
      map.zoom = 14;
    };

    var informUser = function (message) {
      var toast = $mdToast.simple()
        .textContent(message)
        .action('ok')
        .highlightAction(false)
        .hideDelay(4000)
        .position('top right');
      $mdToast.show(toast);
    };

    var geoLocate = function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition( 
          function (position) {
            updateUserCoords(position.coords.latitude, position.coords.longitude);
          },
          function (error) {
            informUser('Could not locate you due to: ' + error.message);
            console.log(error);
          }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
          }
        );
      } else {
        informUser('Your browser does not support geolocation. Please upgrade it.');
        console.log('Geolocation not supported. Defaulting to backup location.');
      }
    };

    geoLocate();

    gMapsApi.then( function (maps) {
      mapsObj = maps;
      map.options.zoomControlOptions.position = maps.ControlPosition.LEFT_BOTTOM;
      map.options.zoomControlOptions.style = maps.ZoomControlStyle.SMALL;
      map.options.streetViewControlOptions.position = maps.ControlPosition.LEFT_BOTTOM;
    });

    return {
      map: map,
      updateUserCoords: updateUserCoords,
      geoLocate: geoLocate
    };

  }]);

})(window.angular);
