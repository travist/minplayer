module.exports = function(grunt) {

  var screenfull = [
    'lib/screenfull.js/dist/screenfull.min.js'
  ];

  var screenfullPath = 'src/minplayer.screenfull.js';

  var files = [
    'src/minplayer.compatibility.js',
    'src/minplayer.async.js',
    'src/minplayer.flags.js',
    'src/minplayer.plugin.js',
    'src/minplayer.display.js',
    'src/minplayer.js',
    'src/minplayer.image.js',
    'src/minplayer.file.js',
    'src/minplayer.playLoader.js',
    'src/minplayer.players.base.js',
    'src/minplayer.players.dailymotion.js',
    'src/minplayer.players.html5.js',
    'src/minplayer.players.flash.js',
    'src/minplayer.players.minplayer.js',
    'src/minplayer.players.youtube.js',
    'src/minplayer.players.vimeo.js',
    'src/minplayer.players.limelight.js',
    'src/minplayer.players.kaltura.js',
    'src/minplayer.controller.js'
  ];

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js'].concat(files)
    },
    concat: {
      options: {
        separator: ''
      },
      screenfull: {
        options: {
          banner: "var minplayer = minplayer || {};\n(function(exports) {",
          footer: "\nexports.screenfull = screenfull;\n})(minplayer);"
        },
        files: {
          'src/minplayer.screenfull.js': screenfull
        }
      },
      build: {
        files: {
          'bin/minplayer.js': [screenfullPath].concat(files)
        }
      }
    },
    uglify: {
      build: {
        files: {
          'bin/minplayer.compressed.js': ['bin/minplayer.js'],
          'bin/minplayer.min.js': ['bin/minplayer.js']
        }
      }
    },
    jsdoc : {
      dist : {
        src: files,
        options: {
          template: 'node_modules/grunt-jsdoc/node_modules/ink-docstrap/template',
          destination: 'doc'
        }
      }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'jsdoc']);
};
