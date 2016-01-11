(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('ngSidenavs', function(){
    
    return { 
      restrict: 'E',
      replace: true,
      templateUrl: 'views/directives/sidenavs.html',
      controller: ['$scope', '$mdSidenav', function ($scope, $mdSidenav) {

        $scope.filterClose = function () {
          $mdSidenav('filter').close();
        };
        
        $scope.leftClose = function () {
          $mdSidenav('left').close();
        };


      }]
    };

  });

})(window.angular);
