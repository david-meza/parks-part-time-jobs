(function(angular) {

  'use strict';

  angular.module('appServices').factory('jobsService', ['$http', '$q', 'geocoderService', '$timeout', 'jobsMapConfig',
    function ($http, $q, geocoderService, $timeout, jobsMapConfig) {

    var jobs = { list: [], mappable: [], categories: {} };

    var getJobsFeed = function (query) {
      return $http({
        method: 'GET',
        url : 'https://giststapplv1:6443/arcgis/rest/services/Parks/ParkLocator/MapServer/5/query?where=' + (query || '1%3D1') + '&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=4326&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&returnDistinctValues=false&resultOffset=&resultRecordCount=&f=pjson'
      });
    };

    var getLocationsMultiple = function () {
      return $http({
        method: 'GET',
        url: '/scripts/joblocations.json'
      });
    };

    var parseDescription = function (desc) {
      if (!desc || desc === '<br />') { return 'No description preview available'; }

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
        arr = categories.split(',');
      }
      return arr;
    };

    var constructJob = function (job) {
      var id = job.JOBID;
      var description = parseDescription(job.DESCRIPTION);
      var categories = parseCategories(job.CATEGORIES);
      var titleUrl = job.TITLE.replace(/\W+/ig, '-').toLowerCase();
      var minSalary = Number(job.MINIMUMSALARY) || 7.25;
      var maxSalary = Number(job.MAXIMUMSALARY) || undefined; // What should we do with null/0 values??
      titleUrl = titleUrl[titleUrl.length - 1] === '-' ? titleUrl.substring(0, titleUrl.length - 1) : titleUrl;

      return {
        id: Number(id),
        objectId: job.OBJECTID,
        title: job.TITLE,
        titleUrl: titleUrl,
        categories: categories,
        department: job.DEPARTMENT,
        description: description,
        jobType: job.JOBTYPE,
        latitude: job.LAT,
        longitude: job.LNG,
        location: job.LOCATION,
        state: 'North Carolina',
        minSalary: minSalary,
        maxSalary: maxSalary,
        interval: job.SALARYINTERVAL,
        // String specifies it is GMT which is automatically localized when it is parsed
        pubDate: new Date(Date.parse(job.PUBDATE)),
        // 5 hour offset from UTC to EST = 18,000s or 18,000,000ms
        createdDate: new Date(Date.parse(job.ADVERTISEFROMDATEUTC) - 18000000),
        // Handle 'Continous' cases with a valid date instead of NaN or Invalid Date obj
        endDate: new Date((Date.parse(job.ADVERTISETODATEUTC) - 18000000) || 'Dec 31 2020 23:59:59'),
        link: job.LINK,
        detailsUrl: ('https://www.governmentjobs.com/careers/raleighnc/jobs/' + id + '/' + titleUrl),
        
        icon: jobsMapConfig.jobMarkersConfig.icon,
        markerClick: jobsMapConfig.markerClick,
        options: {
          title: job.TITLE,
          labelAnchor: '0 0',
          animation: 2
        }
      };
    };

    var isPRCRjob = function (job) {
      var matcher = new RegExp(/prc|parks|recreation/i);
      angular.forEach(job.categories, function (cat) {
        if (matcher.test(cat)) { return true; }
      });
      return matcher.test(job.department);
    };

    var groupById = function (job) {
      angular.isDefined(jobs[job.id]) ? jobs[job.id].push(job) : jobs[job.id] = [job];
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

        var processedJob = constructJob(job.attributes);
        if (processedJob.jobType === 'Full-Time' || !isPRCRjob(processedJob) ) { return; }
        
        groupById(processedJob);
        storeCategory(processedJob);
        
        this.push(processedJob);
        if (processedJob.latitude !== 0 || processedJob.longitude !== 0) {
          jobs.mappable.push(processedJob);
        }

      }, jobs.list);
    };

    var readResponse = function(response) {
      if (response.status === 200) {
        var rawJobs = response.data.features;
        extractJobData(rawJobs);
        return $q.resolve(response);
      } 
      console.log('Did not get the expected results', response);
      return $q.reject(response);
    };

    var logError = function (response) {
      console.log('Failed to get data from jobs server', response);
      return $q.reject(response);
    };

    var geocodeMappableJobs = function () {
      var matcher = new RegExp(/varies|multiple/i);
        
      angular.forEach(jobs.list, function (job) {
        if (matcher.test(job.location) || job.latitude || job.longitude) { return; }

        geocoderService.getLatLng(job.location + ', ' + job.state).then(function(results) {

          job.latitude = results.lat;
          job.longitude = results.lng;
          job.formattedAddress = results.formattedAddress;
          
          jobs.list.push(job);

        }, logError);

      });

    };

    var multiplyJobsMultipleLocations = function (responses) {
      var locations = responses[1].data;
      
      angular.forEach(jobs.list, function (job) {
        var jobDetails = locations[job.id];
        if (jobDetails) {
          
          angular.forEach(jobDetails.locations, function (location) {
            var clone = angular.copy(job);
            clone.location = (location.replace(/^.+-\s*/i, '') + ', Raleigh');
            jobs.list.push(clone);
          });

        }
      });

    };
    
    getJobsFeed().then(readResponse, logError);
    // var promise2 = getLocationsMultiple()
    // $q.all([promise, promise2]).then(multiplyJobsMultipleLocations).then(geocodeMappableJobs);

    return {
      jobs: jobs
    };

  }]);

})(window.angular);
