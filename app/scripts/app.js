(function(angular) {

  'use strict';

  function easeInOutCubic (t) { 
    return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
  }

  angular.module('parkJobs', ['appServices', 'appFilters', 'appControllers', 'appDirectives', 'ngMaterial', 'uiGmapgoogle-maps', 'angular-tour', 'ngAnimate', 'ipCookie', 'duScroll', 'ngStorage'])

    .value('duScrollDuration', 600)
    .value('duScrollOffset', 0)
    .value('duScrollEasing', easeInOutCubic)

    .config(['uiGmapGoogleMapApiProvider', function (uiGmapGoogleMapApiProvider) {
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
    }])

    .config([ '$mdIconProvider', function ($mdIconProvider) {
      $mdIconProvider
        .defaultIconSet('img/icons/core-icons.svg', 48)
        .iconSet('core2', 'img/icons/core-icons2.svg', 24);
    }]);

})(window.angular);

