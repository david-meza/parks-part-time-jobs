(function(angular) {

  'use strict';

  angular.module('appServices').factory('jobsMapConfig', ['mapService',
    function (mapService) {

    var activeCard,
        container;

    var _closeClick = function (windowScope) { 
      windowScope.show = false; 
      if (angular.isDefined(activeCard)) { 
        activeCard.removeClass('selected'); 
        activeCard = undefined;
      }
    };

    var jobWindow = {
      show: false,
      coords: {},
      control: {},
      options: {
        pixelOffset: { width: 0, height: -60 }
      },
      closeclick: _closeClick,
      templateUrl: 'views/partials/job-window.html',
      templateParameter: {},
    };

    var jobMarkersConfig = {
      shallowWatch: false,
      fitToMap: false,
      markerEvents: {
        mouseover: function (gMarker, eventName, model, args) {
          gMarker.setIcon('/img/icons/job-marker-hovered.svg');
          gMarker.labelVisible = true;
          gMarker.label.setVisible();
        },
        mouseout: function (gMarker, eventName, model, args) {
          gMarker.setIcon('/img/icons/job-marker.svg');
          gMarker.labelVisible = false;
          gMarker.label.setVisible();
        }
      },
      rebuild: false,
      control: {},
      icon: '/img/icons/job-marker.svg',
      type: 'spider',
      typeOptions: {
        title: 'Zoom in to find more jobs!',
        gridSize: 60,
        minimumClusterSize: 4
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
      jobWindow.templateParameter.location = jobModel.location;
      jobWindow.show = true;
    };

    var _scrollToJobCard = function (id) {
      if (activeCard) { activeCard.removeClass('selected'); }
      container = container || angular.element(document.getElementById('jobs-list'));
      activeCard = angular.element(document.querySelector('md-card[data-job-id=\'' + id + '\']'));
      container.scrollToElementAnimated(activeCard, 90);
      activeCard.addClass('selected');
    };
    
    var markerClick = function (gInstance, evnt, model) {
      // Center map to marker
      mapService.map.location.coords.latitude = model.latitude;
      mapService.map.location.coords.longitude = model.longitude;
      
      // Position Job Info Window above marker
      _positionWindow(model);

      // Find the card on the job list and scroll to it
      _scrollToJobCard(model.objectId);
    };

    return {
      jobWindow: jobWindow,
      jobMarkersConfig: jobMarkersConfig,
      markerClick: markerClick
    };

  }]);

})(window.angular);
