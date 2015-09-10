#global module:false

"use strict"

module.exports = (grunt) ->
  grunt.loadNpmTasks "grunt-bower-task"
  grunt.loadNpmTasks "grunt-contrib-connect"
  grunt.loadNpmTasks "grunt-contrib-copy"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-exec"

  grunt.initConfig

    copy:
      javascript:
        files: [{
          expand: true
          cwd: "bower_components/jquery/dist/"
          src: "jquery.min.js"
          dest: "vendor/js/"
        },
        {
          expand: true
          cwd: "bower_components/angular/"
          src: "angular.min.js"
          dest: "vendor/js/"
        },
        {
          expand: true
          cwd: "bower_components/highlight/src/"
          src: "highlight.js"
          dest: "vendor/js/"
        },
        {
          expand: true
          cwd: "bower_components/lunr.js/"
          src: "lunr.min.js"
          dest: "vendor/js/"
        }]
      css:
        files: [{
          expand: true
          cwd: "bower_components/highlight/src/styles/"
          src: "obsidian.css"
          dest: "vendor/css/"
        }]

    exec:
      jekyll:
        cmd: "jekyll build --trace"

    watch:
      options:
        livereload: true
      source:
        files: [
          "_includes/**/*"
          "_layouts/**/*"
          "_posts/**/*"
          "assets/**/*"
          "_config.yml"
          "*.html"
          "*.md"
        ]
        tasks: [
          "exec:jekyll"
        ]

    connect:
      server:
        options:
          port: 4000
          base: '_site'
          livereload: true

  grunt.registerTask "build", [
    "copy"
    "exec:jekyll"
  ]

  grunt.registerTask "serve", [
    "build"
    "connect:server"
    "watch"
  ]

  grunt.registerTask "default", [
    "serve"
  ]
