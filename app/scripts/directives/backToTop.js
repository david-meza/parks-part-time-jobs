(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('backToTop', function () {
    
    return { 
      restrict: 'E',
      transclude: true,
      replace: true,
      template: '<div id = "back-to-top" ng-transclude></div>',
      link: function(scope, element) {

        var container = element.parent();
        
        container.on('scroll', function () {
          if (this.scrollTop >= 50) {
            element.addClass('bring-to-screen');
          } else {
            element.removeClass('bring-to-screen');
          }
        });

        scope.scrollToTop = function () {
          container.scrollTopAnimated(0, 800);
        };

      }
    };

  });

})(window.angular);
