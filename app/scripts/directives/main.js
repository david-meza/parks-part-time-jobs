(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('ngMain', function(){
    
    return { 
      restrict: 'E',
      templateUrl: 'views/main.html',
      controller: 'devicesCtrl'
    };

  });

})(window.angular);
