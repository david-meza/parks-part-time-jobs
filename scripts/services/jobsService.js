(function(angular, X2JS) {

  'use strict';

  angular.module('appServices').factory('jobsService', ['$http', '$q', 'uiGmapGoogleMapApi', '$timeout',
    function ($http, $q, mapsApi, $timeout) {

    var parser = new X2JS(),
        jobs = { list: [] };

    
    var getJobsFeed = function () {
      return $http({
        method: 'GET',
        url : 'http://agency.governmentjobs.com/jobfeed.cfm?agency=raleighnc&joblisting:department=PCR%20Recreation'
      });
    };

    var parseDescription = function (desc) {
      if (!desc || desc === '<br />') return 'No description preview available';

      var htmlParser = new DOMParser();
      var nodes = htmlParser.parseFromString(desc, 'text/html');

      return nodes.getElementsByTagName('body')[0].innerText;
    };

    var parseCategories = function (categories) {
      var arr = [];
      if (categories.constructor === Object) {
        arr.push(categories.Category);
      } else if (categories.constructor === Array) {
        angular.forEach(categories, function (cat) {
          this.push(cat.Category);
        }, arr);
      } else {
        console.log(categories);
        arr.push(categories);
      }
      return arr;
    };

    var constructJob = function (job) {
      var description = parseDescription(job.description);
      var categories = parseCategories(job.categories.category);
      var titleUrl = job.title.replace(/\W+/ig, '-').toLowerCase();

      return {
        id: job.jobId.__text,
        title: job.title,
        titleUrl: titleUrl[titleUrl.length - 1] === '-' ? titleUrl.substring(0, titleUrl.length - 1) : titleUrl,
        department: job.department.__text,
        categories: categories,
        description: description,
        jobType: job.jobType.__text,
        location: job.location.__text,
        state: job.state.__text,
        minSalary: Number(job.minimumSalary.__text) || 7.25,
        maxSalary: Number(job.maximumSalary.__text),
        interval: job.salaryInterval.__text,
        createdDate: new Date(Date.parse(job.advertiseFromDate.__text)),
        endDate: job.advertiseToDateTime.__text,
        link: job.link
      };
    };

    var isPRCRjob = function (job) {
      var matcher = new RegExp(/prc|parks|recreation|rcc|temporary/i);
      angular.forEach(job.categories, function (cat) {
        if (matcher.test(cat)) return true;
      });
      return matcher.test(job.department);
    };

    var extractJobData = function (jsonjobs) {
      angular.forEach( jsonjobs, function (job) {

        var processedJob = constructJob(job);

        if (processedJob.jobType === 'Full-Time' || !isPRCRjob(processedJob) ) return;
        console.log(processedJob.location, processedJob.state);
        jobs[processedJob.id] = processedJob;
        this.push(processedJob);

      }, jobs.list);
    };

    var readResponse = function(response) {
      if (response.status >= 200 && response.status < 300) {
        var jsonResponse = parser.xml_str2json(response.data);
        var rawJobs = jsonResponse.rss.channel.item;
        extractJobData(rawJobs);
      } else {
        console.log('Did not get the expected results', response);
      }
    };

    var logError = function (response) {
      return $q.reject(response).then(null, function () {
        console.log('Failed to get data from jobs server', response);
      });
    };

    var geocodeMappableJobs = function () {
      mapsApi.then( function (maps) {
        var geocoder = new maps.Geocoder();
        var matcher = new RegExp(/varies|multiple/i);
        
        angular.forEach(jobs.list, function (job, idx) {
          if (matcher.test(job.location)) return;

          $timeout( function () {
            
            geocoder.geocode( { 'address': job.location }, function (results, status) {
              console.log(status, maps.GeocoderStatus.OK);
              if (status === maps.GeocoderStatus.OK) {
                job.coords = {
                  latitude: results[0].geometry.location.lat(),
                  longitude: results[0].geometry.location.lng()
                };
                console.log(results);
              } else {
                console.log("Geocode was not successful for the following reason: " + status);
              }
            });
            
          }, 250 * idx);

        });
        
      });
    };
    
    getJobsFeed().then(readResponse, logError).then(geocodeMappableJobs);


    return {
      jobs: jobs
    };

  }]);

})(window.angular, X2JS);
