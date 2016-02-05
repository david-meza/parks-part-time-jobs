(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('ngSidenavs', function(){
    
    return { 
      restrict: 'E',
      replace: true,
      templateUrl: 'views/directives/sidenavs.html',
      controller: ['$scope', '$mdSidenav', 'jobsFilterService', 'deviceService', 'jobsService',
        function ($scope, $mdSidenav, jobsFilterService, deviceService, jobsService) {


        var jobContainer = document.getElementById('jobs-list');

        // Left side nav - mobile devices
        $scope.showList = function () {
          deviceService.activeTab.list = true;
          deviceService.activeTab.map = false;
          deviceService.activeTab.name = 'list';
          $scope.closeSidenav('left');
        };

        $scope.hideList = function () {
          deviceService.activeTab.list = false;
          deviceService.activeTab.map = true;
          deviceService.activeTab.name = 'map';
          $scope.closeSidenav('left');
        };

        // Close any sidenav
        $scope.closeSidenav = function (name) {
          $mdSidenav(name).close();
        };


        $scope.settings = {
          distance:   { name: 'Distance', extraScreen: 'distance',  icon: 'img/icons/location.svg', filtersOn: 0 },
          categories: { name: 'Category', extraScreen: 'categories',icon: 'img/icons/work.svg',     filtersOn: 0 },
          salary:     { name: 'Salary',   extraScreen: 'salary',    icon: 'img/icons/salary.svg',   filtersOn: 0 },
        };

        // Initialize filters
        $scope.filters = jobsFilterService.filters;

        $scope.clearFilter = function(filterName, val) {
          if (!filterName) {
            $scope.clearFilter('salary', 0);
            $scope.clearFilter('distance', 9999);
            $scope.clearFilter('categories', []);
            return;
          }
          
          $scope.applyFilter(filterName, val);
          if (filterName === 'categories') { uncheckCategories(); }
        };

        $scope.navigateTo = function(to) {
          $mdSidenav(to).open();
        };

        $scope.applyFilter = function(knd, newVal) {
          jobContainer = jobContainer || document.getElementById('jobs-list');
          // Update the filter with the new value
          $scope.filters[knd] = newVal;

          // Update the icon that we show on the sidebar
          $scope.settings[knd].filtersOn = (typeof newVal === 'object' ? (newVal.length > 10 ? 10 : newVal.length) : (newVal === 0 || newVal === 9999 ? 0 : 1) );

          // Scroll to the top of the md-content job list container to avoid a blank screen if user is scrolled down
          jobContainer.scrollTop = 0;
        };

        $scope.categories = jobsService.jobs.categories;

        var uncheckCategories = function () {
          angular.forEach($scope.categories, function(cat) {
            cat.checked = false;
          });
        };

        $scope.salaryOptions = [8, 10, 12, 15];

        $scope.distanceOptions = [5, 10, 15, 20, 25];

        $scope.catExists = function (name, list) {
          return list.indexOf(name) > -1;
        };

        $scope.catToggle = function (name, list) {
          var idx = list.indexOf(name);
          idx > -1 ? list.splice(idx, 1) : list.push(name);
        };


      }]
    };

  });

})(window.angular);
