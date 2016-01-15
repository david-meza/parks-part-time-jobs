(function(angular) {

  'use strict';

  angular.module('appControllers').controller('jobsListSmCtrl', ['$scope', '$mdDialog', '$mdSidenav', 'jobsFilterService', 'parkService',
    function ($scope, $mdDialog, $mdSidenav, jobsFilterService, parkService) {

      $scope.currentPlace = parkService.currentPlace;
          
      $scope.jobs = [];
      var tempJobs = [
        { title: 'Afterschool Specialist - Teens', salary: 10, description: 'The Teen Afterschool Specialist is responsible for managing the logistics and operations of several different after school programs for middle and high school aged participants throughout the City of Raleigh. The Teen Afterschool Specialist will also work closely with participants to facilitate skill building and enrichment activities.', time: 'Part Time', category: 'Parks and Recreation', location: 'Raleigh, NC', url: 'https://www.governmentjobs.com/careers/raleighnc/jobs/1314835/camp-counselor-southeast-raleigh-district-4/apply', date: new Date(), distance: 0.1 },
        { title: 'Camp Counselor- North/Northwest Raleigh (District 1)', salary: 8.25, description: 'Responsible for the direct supervision of campers, programming age appropriate activities and working with other staff to address the daily needs of a group of children during the summer season.', time: 'Part Time', category: 'Parks and Recreation', location: 'Raleigh, NC', url: 'https://www.governmentjobs.com/careers/raleighnc/jobs/1314835/camp-counselor-southeast-raleigh-district-4/apply', date: new Date(2016, 0, 12, 12, 24, 21), distance: 4.21 },
        { title: 'Camp Counselor- Southeast Raleigh (District 4)', salary: 12.25, description: 'Responsible for the direct supervision of campers, programming age appropriate activities and working with other staff to address the daily needs of a group of children during the summer season.', time: 'Part Time', category: 'Parks and Recreation', location: 'Raleigh, NC', url: 'https://www.governmentjobs.com/careers/raleighnc/jobs/1314835/camp-counselor-southeast-raleigh-district-4/apply', date: new Date(2016, 0, 10, 12, 24, 21), distance: 11.2 },
        { title: 'Camp Counselor - Central Raleigh (District 3)', salary: 20, description: 'Provide a high quality camp experience by incorporating organized activities including: arts and crafts, recreational sports and games, field trips, specialty programs and much more.', time: 'Part Time', category: 'Parks and Recreation', location: 'Raleigh, NC', url: 'https://www.governmentjobs.com/careers/raleighnc/jobs/1314835/camp-counselor-southeast-raleigh-district-4/apply', date: new Date(2016, 0, 11, 12, 24, 21), distance: 7.63 },

      ];

      $scope.parks = parkService.markers;
      $scope.$watch('parks.content.length', function () {
        if ($scope.parks.content.length <= 0) { return; }
        
        $scope.jobs.splice(0, $scope.jobs.length);
        $scope.jobs = $scope.jobs.concat(tempJobs);

        $scope.parks.content.forEach( function (park) {
          $scope.jobs = $scope.jobs.concat(park.jobs);
        });
      });

      $scope.sortOptions = [
        { view: 'nearest', model: 'distance' },
        { view: 'furthest', model: '-distance' },
        { view: 'oldest', model: 'date' }, 
        { view: 'newest', model: '-date' }, 
        { view: 'salary ($ - $$$)', model: 'salary' }, 
        { view: 'salary ($$$ - $)', model: '-salary' }, 
        { view: 'job title (A-Z)', model: 'title' },
        { view: 'job title (Z-A)', model: '-title' }
      ];

      $scope.selectedSort = 'distance';

      $scope.openFilterSelection = function () {
        $mdSidenav('filter').toggle();
      };

      $scope.selectedFilters = jobsFilterService.filters;


  }]);

})(window.angular);