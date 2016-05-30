'use strict';

module.exports = function (grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Automatically load required grunt tasks
  require('jit-grunt')(grunt);

  // Configurable paths
  var config = {
    app: 'src',
    dist: 'dist'
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      javascripts: {
          files: ['<%= config.app %>/*'],
          tasks: ['build'],
          options: {
              livereload: true
          }
      },
      gruntfile: {
        files: ['Gruntfile.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= config.dist %>/*',
            '!<%= config.dist %>/.git*'
          ]
        }]
      },
      app: '.tmp'
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    eslint: {
      target: [
        'Gruntfile.js',
        '<%= config.app %>/{,*/}*.js',
        '!<%= config.app %>/vendor/*'
      ]
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: []
      },
      app: {
        files: []
      }
    },

    uglify: {
      dist: {
        files: {
          '<%= config.dist %>/cool-ng-affix.min.js': [
            '<%= config.dist %>/cool-ng-affix.js'
          ]
        }
      }
    },
    concat: {
      dist: {
        src: ['<%= config.app %>/{,*/}*.js'],
        dest: '<%= config.dist %>/cool-ng-affix.js',
      }
    },

  });


  grunt.registerTask('serve', 'start the server and preview your app', function (target) {

    // if (target === 'dist') {
    //   return grunt.task.run(['build', 'connect:dist']);
    // }

    grunt.task.run([
      'build',
      'watch'
    ]);
  });

  grunt.registerTask('build', [
    'concat',
    'uglify'
    // 'htmlmin'
  ]);

  grunt.registerTask('default', [
    'build'
  ]);
};