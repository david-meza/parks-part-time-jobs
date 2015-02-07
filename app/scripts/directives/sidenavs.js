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
          distance:   { name: 'Distance', extraScreen: 'distance',  icon: 'core2:location', filtersOn: 'core2:filter-none' },
          categories: { name: 'Category', extraScreen: 'categories',icon: 'core2:work',     filtersOn: 'core2:filter-none' },
          salary:     { name: 'Salary',   extraScreen: 'salary',    icon: 'core2:salary',   filtersOn: 'core2:filter-none' },
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

        var updateIcon = function (val) {
          return 'core2:filter-' + (val.constructor === Array ? (val.length >= 10 ? '9-plus' : (val.length || 'none') ) : (val === 0 || val === 9999 ? 'none' : '1') );
        };

        $scope.applyFilter = function(knd, newVal) {
          jobContainer = jobContainer || document.getElementById('jobs-list');
          // Update the filter with the new value
          $scope.filters[knd] = newVal;

          // Update the icon that we show on the sidebar
          $scope.settings[knd].filtersOn = updateIcon(newVal);

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
