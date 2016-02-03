(function(angular) {
 
  'use strict';

  angular.module('appServices').factory('deviceService', ['$window', 
    function($window){

      var _width = $window.innerWidth;
      var activeTab = { name: 'map', list: false, map: true };

      var isMobile = function () {
        return _width < 768;
      };
    

  	return {
      isMobile: isMobile,
      activeTab: activeTab
  	};

  }]);

})(window.angular);
