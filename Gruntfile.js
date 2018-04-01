module.exports = function (grunt) {
    'use strict';
    grunt.initConfig({
        // Metadata
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed <%= props.license %> */\n',
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['src/hypermodel.js'],
                dest: 'dist/hypermodel.js'
            }
        },
        uglify: {
            options: {
                banner: '//================================================================================\n' +
                        '// [<%= pkg.name %>]\n' +
                        '// version: <%= pkg.version %>\n' +
                        '// update: <%= grunt.template.today("yyyy.mm.dd") %>\n' +
                        '//================================================================================\n\n'
            },
            dist: {
                files: {
                    'dist/hypermodel.min.js': ['src/**.js']
                }
            },
        },
        cssmin: {
          options: {
            banner: '//================================================================================\n' +
                    '// [<%= pkg.name %>]\n' +
                    '// version: <%= pkg.version %>\n' +
                    '// update: <%= grunt.template.today("yyyy.mm.dd") %>\n' +
                    '//================================================================================\n\n'
          },
          dist: {
            files: {
              'dist/hypermodel.min.css': ['src/**.css']
            }
          }
        },
        jshint: {
          files: ['Gruntfile.js', 'src/**.js'],
          options: {
            // options here to override JSHint defaults
            globals: {
              jQuery: true,
              console: true,
              module: true,
              document: true
            }
          }
        },
        csslint: {
          dist: ['src/**.css']
        },
        qunit: {
            files: ['test/**/*.html']
        },
        watch: {
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test', 'qunit']
            }
        }
    });

    // These plugins provide necessary tasks
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');

    // Default task
    grunt.registerTask('default', ['jshint', 'csslint', 'cssmin', 'uglify']);
    grunt.registerTask('test', ['jshint', 'csslint']);
};
