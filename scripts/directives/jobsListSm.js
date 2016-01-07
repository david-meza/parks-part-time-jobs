'use strict';

angular.module('parkLocator').directive('jobsListSm', function(){
  
  return {    
    controller: 'jobsListSmCtrl',
    restrict: 'E',
    templateUrl: 'views/directives/jobs-list-sm.html',
    replace: true,
  };

});