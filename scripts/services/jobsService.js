(function(angular, X2JS) {

  'use strict';

  angular.module('appServices').factory('jobsService', ['$http', '$q',
    function ($http, $q) {

    console.log('job service');

    var parser = new X2JS(),
        jobs = { list: [] };

    
    var getJobsFeed = function () {
      return $http({
        method: 'GET',
        url : 'http://agency.governmentjobs.com/jobfeed.cfm?agency=raleighnc&joblisting:department=PCR%20Recreation'
      });
    };

    var parseDescription = function (desc) {
      if (!desc) return '';

      var htmlParser = new DOMParser();
      var nodes = htmlParser.parseFromString(desc, 'text/html');

      return nodes.getElementsByTagName('body')[0].innerText;

    };

    var extractJobData = function (jsonjobs) {
      angular.forEach( jsonjobs, function (job) {

        var description = parseDescription(job.description);
        var titleUrl = job.title.replace(/\W+/ig, '-').toLowerCase();
        var processedJob = {
          id: job.jobId.__text,
          title: job.title,
          titleUrl: titleUrl[titleUrl.length - 1] === '-' ? titleUrl.substring(0, titleUrl.length - 1) : titleUrl,
          category: job.department.__text,
          description: description,
          jobType: job.jobType.__text,
          location: job.location.__text,
          minSalary: job.minimumSalary.__text,
          maxSalary: job.maximumSalary.__text,
          interval: job.salaryInterval.__text,
          createdDate: new Date(Date.parse(job.advertiseFromDate.__text)),
          endDate: new Date(Date.parse(job.advertiseToDateTime.__text)),
          link: job.link
        };

        jobs[processedJob.id] = processedJob;
        this.push(processedJob);
      }, jobs.list);
      console.log(jobs.list);
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
      return $q.reject(response).then( function () {
        console.log('Failed to get data from jobs server', response);
      });
    };
    
    getJobsFeed().then(readResponse, logError);


    return {
      jobs: jobs
    };

  }]);

})(window.angular, X2JS);
