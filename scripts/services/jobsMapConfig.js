(function(angular) {

  'use strict';

  angular.module('appServices').factory('jobsMapConfig',
    function () {


    var _closeClick = function (windowScope) { 
      windowScope.show = false; 
    };

    var jobWindow = {
      show: false,
      coords: {},
      control: {},
      options: {
        pixelOffset: { width: 0, height: -48 }
      },
      closeclick: _closeClick,
      templateUrl: 'views/partials/job-window.html',
      templateParameter: {},
    };

    var jobMarkersConfig = {
      shallowWatch: false,
      fitToMap: false,
      markerEvents: {},
      rebuild: false,
      control: {},
      type: 'cluster',
      typeOptions: {
        title: 'Zoom in to find more jobs!',
        gridSize: 60,
        minimumClusterSize: 10
      },
      typeEvents: {}
    };

    jobMarkersConfig.typeOptions.styles = [{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: 'img/icons/job-marker-cluster.svg',height: 48,width: 48},{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: 'img/icons/job-marker-cluster.svg',height: 50,width: 50},{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: 'img/icons/job-marker-cluster.svg',height: 54,width: 54},{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: 'img/icons/job-marker-cluster.svg',height: 58,width: 58},{textColor: '#FFF',textSize: 18,fontFamily: 'Roboto, Helvetica, Verdana, sans-serif',anchorText: [5, -5],url: 'img/icons/job-marker-cluster.svg',height: 62,width: 62}];

    var _positionWindow = function(jobModel) {
      jobWindow.coords.latitude = jobModel.latitude;
      jobWindow.coords.longitude = jobModel.longitude;
      jobWindow.templateParameter.title = jobModel.title;
      jobWindow.templateParameter.minSalary = jobModel.minSalary;
      jobWindow.templateParameter.maxSalary = jobModel.maxSalary;
      jobWindow.templateParameter.jobType = jobModel.jobType;
      jobWindow.templateParameter.interval = jobModel.interval;
      jobWindow.templateParameter.detailsUrl = jobModel.detailsUrl;
      jobWindow.templateParameter.formattedAddress = jobModel.formattedAddress;
      jobWindow.show = true;
    };
    
    var markerClick = function (gInstance, evnt, model) {
      _positionWindow(model);
    };

    return {
      jobWindow: jobWindow,
      jobMarkersConfig: jobMarkersConfig,
      markerClick: markerClick
    };

  });

})(window.angular);
