(function(angular, X2JS) {

  'use strict';

  angular.module('appServices').factory('jobsService', ['$http', '$q', 'geocoderService', '$timeout', 'jobsMapConfig',
    function ($http, $q, geocoderService, $timeout, jobsMapConfig) {

    var parser = new X2JS(),
        jobs = { list: [], mappable: [], categories: {} };

    
    var getJobsFeed = function () {
      return $http({
        method: 'GET',
        url : 'https://agency.governmentjobs.com/jobfeed.cfm?agency=raleighnc',
        headers: {
          'Content-Type': 'xml',
          // 'Access-Control-Allow-Origin': 'http://127.0.0.1:54593'
        }
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
      var id = job.jobId.__text
      var description = parseDescription(job.description);
      var categories = parseCategories(job.categories.category);
      var titleUrl = job.title.replace(/\W+/ig, '-').toLowerCase();
      titleUrl = titleUrl[titleUrl.length - 1] === '-' ? titleUrl.substring(0, titleUrl.length - 1) : titleUrl;

      return {
        id: id,
        title: job.title,
        titleUrl: titleUrl,
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
        link: job.link,
        detailsUrl: ('https://www.governmentjobs.com/careers/raleighnc/jobs/' + id + '/' + titleUrl)
      };
    };

    var isPRCRjob = function (job) {
      var matcher = new RegExp(/prc|parks|recreation|rcc|temporary/i);
      angular.forEach(job.categories, function (cat) {
        if (matcher.test(cat)) return true;
      });
      return matcher.test(job.department);
    };

    var storeCategory = function (job) {
      angular.forEach(job.categories, function (cat) {
        if (jobs.categories[cat]) {
          jobs.categories[cat].jobCount += 1; 
        } else {
          jobs.categories[cat] = {
            name: cat,
            jobCount: 1,
            checked: false
          };
        }
      });
    };

    var extractJobData = function (jsonjobs) {
      angular.forEach( jsonjobs, function (job) {

        var processedJob = constructJob(job);

        if (processedJob.jobType === 'Full-Time' || !isPRCRjob(processedJob) ) return;
        jobs[processedJob.id] = processedJob;
        storeCategory(processedJob);
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
      return $q.reject(response).then(null, function (response) {
        console.log('Failed to get data from jobs server', response);
      });
    };

    var geocodeMappableJobs = function () {
      var matcher = new RegExp(/varies|multiple/i);
        
      angular.forEach(jobs.list, function (job) {
        if (matcher.test(job.location)) { return; }

        geocoderService.getLatLng(job.location + ', ' + job.state).then(function(results) {
          
          job.latitude = results.lat;
          job.longitude = results.lng;
          job.formattedAddress = results.formattedAddress;
          job.icon = 'img/icons/job-marker.svg';
          job.markerClick = jobsMapConfig.markerClick;
          job.options = {
            title: job.title,
            labelAnchor: '0 0',
            animation: 2
          };
          
          jobs.mappable.push(job);

        }, logError);

      });

    };
    
    getJobsFeed().then(readResponse, logError).then(geocodeMappableJobs);


    return {
      jobs: jobs
    };

  }]);

})(window.angular, X2JS);
