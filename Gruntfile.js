module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['index.html'],
        exclude: [
          // 'bower_components/jquery/dist/jquery.js',
          // 'bower_components/bootstrap/dist/js/bootstrap.js',
          // 'bower_components/bootstrap-css/js/bootstrap.min.js'
        ]
      },
      sass: {
        src: ['styles/{,*/}*.{scss,sass}'],
        ignorePath: 'bower_components/'
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            'dist/scripts/{,*/}*.js',
            'dist/styles/{,*/}*.css',
            'dist/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            'dist/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: 'index.html',
      options: {
        dest: 'dist',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['dist/{,*/}*.html'],
      css: ['dist/styles/{,*/}*.css'],
      options: {
        assetsDirs: ['dist']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        root: '/'
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: 'dist/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: 'images',
          src: '{,*/}*.svg',
          dest: 'dist/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: 'dist',
          src: ['*.html', 'views/{,*/}*.html', 'scripts/directives/{,*/}*.html'],
          dest: 'dist'
        }]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['dist/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: 'app',
          dest: 'dist',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'scripts/directives/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'fonts/*',
            'mockData/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: 'dist/images',
          src: ['generated/*']
        }]
      },
      styles: {
        expand: true,
        cwd: 'styles',
        dest: '.tmp/styles/',
        src: '{,*/}*.css'
      }
    },

    targethtml: {
      dist: {
        files: {
          'dist/index.html': 'dist/index.html'
        }
      }
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      },
      // Jenkins settings
      continuous: {
        configFile: 'karma.conf.js',
        singleRun: true,
        browsers: ['PhantomJS'],
        reporters: ['dots', 'junit'],
        junitReporter: {
          outputFile: 'test-results.xml'
        }
      }
    },

    compress: {
      main: {
        options: {
          mode: 'tgz',
          archive: 'target/myFinishedApp.tgz'
        },
        files: [{
          expand: true,
          src: '**/*',
          cwd: 'dist/',
          dot: true
        }]
      }
    }
  });

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'targethtml:dist',
    'htmlmin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('cibuild', [
    'karma:continuous',
    'build',
    'compress'
  ]);
};