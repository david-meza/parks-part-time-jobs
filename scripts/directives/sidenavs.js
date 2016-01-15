(function(angular) {

  'use strict';

  angular.module('appDirectives').directive('ngSidenavs', function(){
    
    return { 
      restrict: 'E',
      replace: true,
      templateUrl: 'views/directives/sidenavs.html',
      controller: ['$scope', '$mdSidenav', 'jobsFilterService', 'deviceService', 
        function ($scope, $mdSidenav, jobsFilterService, deviceService) {

        $scope.showList = function () {
          deviceService.activeTab.list = true;
          deviceService.activeTab.map = false;
          deviceService.activeTab.name = 'list';
          $scope.leftClose();
        };

        $scope.hideList = function () {
          deviceService.activeTab.list = false;
          deviceService.activeTab.map = true;
          deviceService.activeTab.name = 'map';
          $scope.leftClose();
        };

        $scope.filterClose = function () {
          $mdSidenav('filter').close();
        };
        
        $scope.leftClose = function () {
          $mdSidenav('left').close();
        };
        
        $scope.salaryClose = function () {
          $mdSidenav('salary').close();
        };

        $scope.categoryClose = function () {
          $mdSidenav('category').close();
        };

        $scope.distanceClose = function () {
          $mdSidenav('distance').close();
        };

        $scope.settings = [
          { name: 'Distance', extraScreen: 'distance',  icon: 'img/icons/location.svg', filtersOn: 0 },
          { name: 'Category', extraScreen: 'category',  icon: 'img/icons/work.svg',     filtersOn: 0 },
          { name: 'Salary',   extraScreen: 'salary',    icon: 'img/icons/salary.svg',   filtersOn: 0 },
        ];

        var idxLookup = {
          distance: 0,
          categories: 1,
          salary: 2,
        };

        // Initialize filters
        $scope.filters = jobsFilterService.filters;

        $scope.clearFilter = function(filterName, val) {
          if (filterName === 'all') {
            $scope.applyFilter('salary', 0);
            $scope.applyFilter('distance', 9999);
            $scope.applyFilter('categories', []);
            uncheckCategories();
          } else {
            $scope.applyFilter(filterName, val);
          }
        };

        $scope.navigateTo = function(to, event) {
          $mdSidenav(to).open();
        };

        $scope.applyFilter = function(knd, newVal) {
          // Update the filter with the new value
          $scope.filters[knd] = newVal;

          // Update the icon that we show on the sidebar
          $scope.settings[idxLookup[knd]].filtersOn = (typeof newVal === 'object' ? (newVal.length > 10 ? 10 : newVal.length) : (newVal === 0 || newVal === 9999 ? 0 : 1) );
        };

        $scope.categories = [
          { name: 'Parks and Recreation', jobs: 4, checked: false},
          { name: 'Camping', jobs: 6, checked: false},
          { name: 'Swimming', jobs: 2, checked: false},
          { name: 'Engineering', jobs: 1, checked: false},
          { name: 'Etc', jobs: 0, checked: false},
        ];

        var uncheckCategories = function () {
          angular.forEach($scope.categories, function(cat) {
            cat.checked = false;
          });
        };

        $scope.salaryOptions = [10, 15, 20, 25, 30];

        $scope.distanceOptions = [5, 10, 15, 20, 25, 30];

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
