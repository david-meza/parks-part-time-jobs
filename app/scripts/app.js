(function(angular) {

  'use strict';

  function easeInOutCubic (t) { 
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 
  }

  angular.module('parkJobs', ['appServices', 'appFilters', 'appControllers', 'appDirectives', 'ui.router', 'ngMaterial', 'uiGmapgoogle-maps', 'angular-tour', 'dcbImgFallback', 'ngAnimate', 'ipCookie', 'duScroll', 'ngStorage'])

    .value('duScrollDuration', 600)
    .value('duScrollOffset', 0)
    .value('duScrollEasing', easeInOutCubic)

    .config(['uiGmapGoogleMapApiProvider', 
      function(uiGmapGoogleMapApiProvider) {
        uiGmapGoogleMapApiProvider.configure({
            signed_in: true,
            v: '3.22',
            libraries: 'places'
        });
    }])

    .config(['tourConfig', function (tourConfig) {
      tourConfig.backDrop = true;
    }])

    .config([ '$httpProvider', function ($httpProvider) {

      $httpProvider.interceptors.push('httpInterceptor');
      
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
          });

    }]);

})(window.angular);

