(function(angular) {

  'use strict';

  angular.module('appServices').factory('mapService', ['uiGmapGoogleMapApi', '$mdToast',
    function (gMapsApi, $mdToast) {


    var mapsObj;

    gMapsApi.then( function (maps) {
      mapsObj = maps;
      map.searchbox.options.bounds = new mapsObj.LatLngBounds(new mapsObj.LatLng(35.437814,-78.984583), new mapsObj.LatLng(36.113561,-78.336890));
    });

    // Temporary coordinates while Geoloc gets us the user's coords
    var location = {
    	coords: {
  	    latitude: 35.79741992502266, 
  	    longitude: -78.64118938203126
    	}
    };

    var map = {
    	// 1 to 20 - 20 being closely zoomed in
      zoom: 12,
      // turns to true when the map is being dragged
      dragging: false,
      // set to true to trigger a map refresh when necessary
      refresh: false,
      pan: false,
      location: location,
      control: {},
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
        minZoom: 1,
        tilt: 45,
        zoomControl: true,
        zoomControlOptions: {
          position: mapsObj ? mapsObj.ControlPosition.LEFT_BOTTOM : 6,
          style: mapsObj ? mapsObj.ZoomControlStyle.SMALL : 1,
        },
        mapTypeControl: false,
        scaleControl: false,
        streetViewControl: false,
        rotateControl: false,
        panControl: false
      },
    };

    // Optional map themes
    // Light browns and greens (nature)
    map.options.styles = [{'featureType':'poi.park','elementType':'geometry.fill','stylers':[{'color':'#519c2f'},{'gamma':'1.27'}]},{'featureType':'poi.park','elementType':'labels.text.stroke','stylers':[{'visibility':'on'},{'color':'#e4bd2e'},{'weight':'3.14'},{'gamma':'1.58'}]},{'featureType':'poi.school','elementType':'labels','stylers':[{'visibility': 'off'}]},{'featureType':'poi.business','elementType':'labels','stylers':[{'visibility': 'off'}]},{'featureType':'poi.place_of_worship','elementType':'labels','stylers':[{'visibility': 'off'}]},{'featureType':'road.local','elementType':'labels','stylers':[{'visibility': 'off'}]},{'featureType':'landscape','stylers':[{'hue':'#FFBB00'},{'saturation':43.400000000000006},{'lightness':37.599999999999994},{'gamma':1}]},{'featureType':'road.highway','stylers':[{'hue':'#FFC200'},{'saturation':-61.8},{'lightness':45.599999999999994},{'gamma':1}]},{'featureType':'road.arterial','stylers':[{'hue':'#FF0300'},{'saturation':-100},{'lightness':51.19999999999999},{'gamma':1}]},{'featureType':'road.local','stylers':[{'hue':'#FF0300'},{'saturation':-100},{'lightness':52},{'gamma':1}]},{'featureType':'water','stylers':[{'hue':'#0078FF'},{'saturation':-13.200000000000003},{'lightness':2.4000000000000057},{'gamma':1}]}];

    // Light blues and greys 
    map.options.secondaryStyles = [{'featureType':'water','stylers':[{'visibility':'on'},{'color':'#b5cbe4'}]},{'featureType':'landscape','stylers':[{'color':'#efefef'}]},{'featureType':'road.highway','elementType':'geometry','stylers':[{'color':'#83a5b0'}]},{'featureType':'road.arterial','elementType':'geometry','stylers':[{'color':'#bdcdd3'}]},{'featureType':'road.local','elementType':'geometry','stylers':[{'color':'#ffffff'}]},{'featureType':'poi.park','elementType':'geometry','stylers':[{'color':'#e3eed3'}]},{'featureType':'administrative','stylers':[{'visibility':'on'},{'lightness':33}]},{'featureType':'road'},{'featureType':'poi.park','elementType':'labels','stylers':[{'visibility':'on'},{'lightness':20}]},{},{'featureType':'road','stylers':[{'lightness':20}]}];

    // Marker for current location (Geolocation or default)
    map.myLocationMarker = {
      id: 0,
      coords: { latitude: location.coords.latitude, longitude: location.coords.longitude },
      options: {
        draggable: false,
        clickable: false,
        icon: 'https://s3.amazonaws.com/davidmeza/Park_Locator/user.png',
        animation: (mapsObj ? mapsObj.Animation.DROP : 2)
      },
    };

    // Get our map instance when it loads
    map.events = {
      tilesloaded: function () {
        map.mapInstance = map.control.getGMap();
      }
    };

    // Search box
    map.searchbox = {
      template: 'views/partials/search-box.html',
      position: 'TOP_RIGHT',
      options: {},
      events: {
        places_changed: function (searchBox) {
          var loc = searchBox.getPlaces()[0].geometry.location;
          moveToPos(loc.lat(), loc.lng());
  	    }
  	  }
    };

  	var _isInRaleigh = function (lat, lon) {
      return lat < 36.113561 && lat > 35.437814 && lon < -78.336890 && lon > -78.984583;
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
        // .capsule(true)
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
          }, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 30000
          }
        );
      } else {
        console.log('Geolocation not supported. Defaulting to backup location.');
      }
    };

    geoLocate();

    var moveToPos = function (lat, lon) {
      map.location.coords.latitude = lat;
      map.location.coords.longitude = lon;
      map.zoom = 16;
    };

    return {
      map: map,
      updateUserCoords: updateUserCoords,
      geoLocate: geoLocate
    };

  }]);

})(window.angular);
