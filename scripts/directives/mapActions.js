(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('mapActions', function(){
    
    return { 
      restrict: 'E',
      replace: true,
      templateUrl: 'views/directives/map-actions.html',
      controller: 'mapActionsCtrl'
    };

  });

})(window.angular);