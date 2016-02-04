(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('gmapsAddress', ['$timeout',
    function ($timeout) {
    
    return { 
      restrict: 'AE',
      transclude: true,
      replace: true,
      template: '<div ng-transclude></div>',
      scope: {
        inputId: '='
      },
      controller: 'autocompleteCtrl',
      
      link: function(scope, element) {

        $timeout(function(){
          var dropdown = document.getElementsByClassName('pac-container');
          element.append(dropdown);
        }, 0);


      }
    };

  }]);

})(window.angular);
