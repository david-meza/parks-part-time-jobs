(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('backToTop', ['$window', function ($window) {
    
    return { 
      restrict: 'E',
      transclude: true,
      template: '<div id = "back-to-top" ng-transclude></div>',
      link: function(scope, element) {

        angular.element($window).bind('scroll', function() {
          if (this.pageYOffset >= 100) {
            element.addClass('bring-to-screen');
          } else {
            element.removeClass('bring-to-screen');
          }
        });

      }
    };

  }]);

})(window.angular);
