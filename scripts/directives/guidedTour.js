(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('guidedTour', function(){
    
    return { 
      restrict: 'E',
      // replace: true,
      templateUrl: 'views/directives/guided-tour.html',
      controller: 'tourCtrl'
    };

  });

})(window.angular);
