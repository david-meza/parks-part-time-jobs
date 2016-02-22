(function(angular) {
 
  'use strict';

  angular.module('appServices').factory('deviceService', ['$window', 
    function($window){

    
    var _width = $window.innerWidth;

    var isMobile = function () {
      return _width < 960;
    };
    
    // If we are on a desktop computer show both list and map, otherwise start showing the map only.
    var activeTab = { name: 'map', list: !isMobile(), map: true };

  	return {
      isMobile: isMobile,
      activeTab: activeTab
  	};

  }]);

})(window.angular);
