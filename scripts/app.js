(function(angular) {

  'use strict';

  angular.module('parkJobs', ['appServices', 'appFilters', 'appControllers', 'appDirectives', 'ui.router', 'ngMaterial', 'uiGmapgoogle-maps', 'smoothScroll', 'dcbImgFallback', 'ngAnimate'])

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
        .primaryPalette('purple')
        .accentPalette('red')
        .warnPalette('yellow');
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
            templateUrl: 'views/main.html',
            controller: 'devicesCtrl'
          })

          .state('home.park', {
            url: ':name',
            templateUrl: 'views/park-information.html',
            controller: 'parkCtrl'
          });

    }]);

})(window.angular);

