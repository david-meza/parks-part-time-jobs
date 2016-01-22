(function(angular) {

  'use strict';

  angular.module('parkJobs', ['appServices', 'appFilters', 'appControllers', 'appDirectives', 'ui.router', 'ngMaterial', 'uiGmapgoogle-maps', 'angular-tour', 'dcbImgFallback', 'ngAnimate', 'ipCookie'])

    .config(['uiGmapGoogleMapApiProvider', 
      function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            v: '3.20',
            libraries: 'places, geometry'
        });
    }])

    .config([ '$httpProvider', function ($httpProvider) {

      $httpProvider.interceptors.push('httpInterceptor');
      $httpProvider.defaults.useXDomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
      $httpProvider.defaults.headers.common.Accept = 'application/json';
      $httpProvider.defaults.headers.common['Content-Type'] = 'application/json';
      
    }])

    .config([ '$mdThemingProvider', function ($mdThemingProvider) {
      $mdThemingProvider.theme('altTheme')
        .primaryPalette('deep-purple')
        .accentPalette('red')
        .warnPalette('yellow');

      // $mdThemingProvider.theme('default')
      //   .primaryPalette('deep-purple');
    }])

    .config([ '$mdIconProvider', function ($mdIconProvider) {
      $mdIconProvider
        .icon('$default:0', 'img/icons/filter-none.svg')
        .icon('$default:1', 'img/icons/filter-1.svg')
        .icon('$default:2', 'img/icons/filter-2.svg')
        .icon('$default:3', 'img/icons/filter-3.svg')
        .icon('$default:4', 'img/icons/filter-4.svg')
        .icon('$default:5', 'img/icons/filter-5.svg')
        .icon('$default:6', 'img/icons/filter-6.svg')
        .icon('$default:7', 'img/icons/filter-7.svg')
        .icon('$default:8', 'img/icons/filter-8.svg')
        .icon('$default:9', 'img/icons/filter-9.svg')
        .icon('$default:10', 'img/icons/filter-9-plus.svg');
    }])

    .config(['$stateProvider', '$urlRouterProvider', 
      function ($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/');


        $stateProvider
          .state('home', {
            url: '/',
            views: {
              '': {
                templateUrl: 'views/main.html',
                controller: 'devicesCtrl'
              },
              'job-details@home': {
                templateUrl: 'views/directives/jobs-list-sm.html',
                controller: 'jobsListSmCtrl'
              }
            }
          })

          .state('home.park', {
            url: ':name',
            views: {
              'job-details': {
                templateUrl: 'views/directives/jobs-list-sm.html',
                controller: 'parkCtrl'
              }
            }
          });

    }]);

})(window.angular);

