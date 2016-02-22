(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('stickyElement', ['$mdSticky', '$timeout', '$compile', 
    function ($mdSticky, $timeout, $compile) {

    var template = '<div ng-transclude layout-padding flex="none" class="md-primary jobs-subheader" layout = "row"></div>';
    
    return { 
      restrict: 'AE',
      replace: true,
      transclude: true,
      template: template,
      link: function(scope, element, attrs, ctrl, $transclude) {
        $timeout(function(){
          $mdSticky(scope, element, $compile(template, $transclude)(scope));
        }, 500);
      }
    };

  }]);

})(window.angular);
