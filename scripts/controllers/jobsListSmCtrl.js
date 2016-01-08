(function(angular) {

  'use strict';

  angular.module('appControllers').controller('jobsListSmCtrl', ['$scope', '$mdDialog',
    function ($scope, $mdDialog) {
          
      $scope.jobs = [
        { title: 'Afterschool Specialist - Teens', salary: '$10.00 hourly', description: 'The Teen Afterschool Specialist is responsible for managing the logistics and operations of several different after school programs for middle and high school aged participants throughout the City of Raleigh. The Teen Afterschool Specialist will also work closely with participants to facilitate skill building and enrichment activities.', time: 'Part Time', category: 'Parks and Recreation', location: 'Raleigh, NC', url: 'https://www.governmentjobs.com/careers/raleighnc/jobs/1314835/camp-counselor-southeast-raleigh-district-4/apply' },
        { title: 'Camp Counselor- North/Northwest Raleigh (District 1)', salary: '$8.25 Hourly', description: 'Responsible for the direct supervision of campers, programming age appropriate activities and working with other staff to address the daily needs of a group of children during the summer season.', time: 'Part Time', category: 'Parks and Recreation', location: 'Raleigh, NC', url: 'https://www.governmentjobs.com/careers/raleighnc/jobs/1314835/camp-counselor-southeast-raleigh-district-4/apply' },
        { title: 'Camp Counselor- Southeast Raleigh (District 4)', salary: '$8.25 Hourly', description: 'Act as a positive role model at all times; pay close attention to detail; adhere to City of Raleigh Policies and Procedures and attention training prior to program start date.', time: 'Part Time', category: 'Parks and Recreation', location: 'Raleigh, NC', url: 'https://www.governmentjobs.com/careers/raleighnc/jobs/1314835/camp-counselor-southeast-raleigh-district-4/apply' },
        { title: 'Camp Counselor - Central Raleigh (District 3)', salary: '$8.25 Hourly', description: 'Provide a high quality camp experience by incorporating organized activities including: arts and crafts, recreational sports and games, field trips, specialty programs and much more.', time: 'Part Time', category: 'Parks and Recreation', location: 'Raleigh, NC', url: 'https://www.governmentjobs.com/careers/raleighnc/jobs/1314835/camp-counselor-southeast-raleigh-district-4/apply' },

      ];

      $scope.sortOptions = ['distance', 'salary', 'posting date', 'job title'];
      $scope.selectedSort = 'distance';

      // Opens the dialog showing address edit input field
      $scope.editLocation = function (ev) {
        $mdDialog.show({
          templateUrl: 'views/partials/filter-dialog.html',
          targetEvent: ev,
          fullscreen: true,
          clickOutsideToClose:true,
          controller: 'DialogCtrl',
          bindToController: true
        });
      };

      $scope.openFilterSelection = function (ev) {
        console.log(ev);
      };

  }]);

})(window.angular);