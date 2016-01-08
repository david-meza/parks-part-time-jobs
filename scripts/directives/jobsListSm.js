(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('jobsListSm', function(){
    
    return {    
      controller: 'jobsListSmCtrl',
      restrict: 'E',
      templateUrl: 'views/directives/jobs-list-sm.html',
      replace: true,
    };

  });

})(window.angular);
