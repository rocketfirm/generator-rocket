// Generated on <%= (new Date).toISOString().split('T')[0] %> using
// <%= pkg.name %> <%= pkg.version %>
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// If you want to recursively match all subfolders, use:
// 'test/spec/**/*.js'

module.exports = function(grunt) {

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Load grunt tasks automatically
  require('jit-grunt')(grunt, {
    useminPrepare: 'grunt-usemin'<% if (includeSprites) { %>,
    sprite: 'grunt-spritesmith'<% } %>
  });

  // Configurable paths
  var config = {
    tmp: '.tmp',
    app: 'app',
    dist: 'dist',
  };

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    config: config,

    // Watches files for changes and runs tasks based on the changed files
    watch: {<% if (includeHandlebars) { %>
      assemble: {
        files: ['<%%= config.app %>/{,*/}*.hbs'],
        tasks: ['newer:assemble:server'],
      },<% } %>
      bower: {
        files: ['bower.json'],
        tasks: ['wiredep'],
      },<% if (babel) { %>
      babel: {
        files: ['<%%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['babel:dist'],
      },
      babelTest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['babel:test', 'test:watch'],
      },<% } else { %>
      js: {
        files: ['<%%= config.app %>/scripts/{,*/}*.js'],
        tasks: ['jshint'],
      },
      jstest: {
        files: ['test/spec/{,*/}*.js'],
        tasks: ['test:watch'],
      },<% } %>
      gruntfile: {
        files: ['Gruntfile.js'],
      },<% if (includeSass) { %>
      sass: {
        files: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['sass:server', 'cssnext'],
      },<% } %>
      styles: {
        files: ['<%%= config.app %>/styles/{,*/}*.css'],
        tasks: ['newer:copy:styles', 'cssnext'],
      }<% if (includeSprites) { %>,
      icons: {
        files: ['<%= config.app %>/images/icons/{,*/}*.png'],
        tasks: ['sprite:server', 'sass:server'],
      }<% } %>
    },

    // The actual grunt server settings
    browserSync: {
      options: {
        notify: false,
        background: true
      },
      livereload: {
        options: {
          files: [<% if (includeHandlebars) { %>
            '<%%= config.tmp %>/{,*/}*.html',<% } else { %>
            '<%%= config.app %>/{,*/}*.html',<% } %>
            '<%%= config.tmp %>/styles/{,*/}*.css',
            '<%%= config.app %>/images/{,*/}*',
            '<%%= config.app %>/scripts/{,*/}*.js',
          ],
          port: 9000,
          server: {
            baseDir: [config.tmp, config.app],
            routes: {
              '/bower_components': './bower_components',
            }
          }
        }
      },
      test: {
        options: {
          port: 9001,
          open: false,
          logLevel: 'silent',
          host: 'localhost',
          server: {
            baseDir: [config.tmp, './test', config.app],
            routes: {
              '/bower_components': './bower_components',
            }
          }
        }
      },
      dist: {
        options: {
          background: false,
          server: '<%%= config.dist %>',
        }
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '<%%= config.tmp %>',
            '<%%= config.dist %>/*',
            '!<%%= config.dist %>/.git*',
          ]
        }]
      },
      server: '<%%= config.tmp %>',
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish'),
      },
      all: [
        'Gruntfile.js',
        '<%%= config.app %>/scripts/{,*/}*.js',
        '!<%%= config.app %>/scripts/vendor/*',
        'test/spec/{,*/}*.js',
      ]
    },<% if (testFramework === 'mocha') { %>

    // Mocha testing framework configuration options
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%%= browserSync.test.options.hostname %>:<%%= browserSync.test.options.port %>/index.html'],
        }
      }
    },<% } else if (testFramework === 'jasmine') { %>

    // Jasmine testing framework configuration options
    jasmine: {
      all: {
        options: {
          specs: 'test/spec/{,*/}*.js',
        }
      }
    },<% } %><% if (babel) { %>

    // Transpiles Future JavaScript to compatible JavaScript
    babel: {
      options: {
        sourceMap: true,
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/scripts',
          src: '{,*/}*.js',
          dest: '<%%= config.tmp %>/scripts',
          ext: '.js',
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.js',
          dest: '<%%= config.tmp %>/spec',
          ext: '.js',
        }]
      }
    },<% } %><% if (includeSass) { %>

    // Compiles Sass to CSS and generates necessary files if requested
    sass: {
      options: {
        sourceMap: true,
        includePaths: ['bower_components'<% if (includeSprites) { %>
          , '<%%= config.tmp %>/styles'<% } %>],
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '<%%= config.tmp %>/styles',
          ext: '.css',
        }]
      },
      server: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/styles',
          src: ['*.{scss,sass}'],
          dest: '<%%= config.tmp %>/styles',
          ext: '.css',
        }]
      }
    },<% } %>

    // Use tomorrow's CSS syntax, today
    cssnext: {
      options: {
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
        sourceMap: true,
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.tmp %>/styles/',
          src: '{,*/}*.css',
          dest: '<%%= config.tmp %>/styles/',
        }]
      }
    },

    // Automatically inject Bower components into the HTML file
    wiredep: {
      app: {<% if (includeHandlebars) { %>
        ignorePath: /^<%= config.app %>\/|\.\.\/\.\.\//,
        src: ['<%%= config.app %>/_layouts/default.hbs']<% } else { %>
        ignorePath: /^<%= config.app %>\/|\.\.\//,
        src: ['<%%= config.app %>/index.html']<% } %><% if (includeBootstrap) { %>,<% if (includeSass) { %>
        exclude: [
          'bower_components/bootstrap-sass-official/assets/javascripts/bootstrap.js',
          'bower_components/respond/dest/respond.src.js',
        ]<% } else { %>
        exclude: [
          'bower_components/bootstrap/dist/js/bootstrap.js',
          'bower_components/respond/dest/respond.src.js',
        ]<% } } %>
      }<% if (includeSass) { %>,
      sass: {
        src: ['<%%= config.app %>/styles/{,*/}*.{scss,sass}'],
        ignorePath: /(\.\.\/){1,2}bower_components\//,
      }<% } %>
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%%= config.dist %>/scripts/{,*/}*.js',
            '<%%= config.dist %>/styles/{,*/}*.css',
            '<%%= config.dist %>/images/{,*/}*.*',
            '<%%= config.dist %>/styles/fonts/{,*/}*.*',
            '<%%= config.dist %>/*.{ico,png}',
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      options: {
        dest: '<%%= config.dist %>'
      },<% if (includeHandlebars) {  %>
      html: '<%%= config.tmp %>/index.html',<% } else { %>
      html: '<%%= config.app %>/index.html',<% } %>
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      options: {
        assetsDirs: [
          '<%%= config.dist %>',
          '<%%= config.dist %>/images',
          '<%%= config.dist %>/styles',
        ]
      },
      html: ['<%%= config.dist %>/{,*/}*.html'],
      css: ['<%%= config.dist %>/styles/{,*/}*.css'],
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/images',
          src: '{,*/}*.{gif,jpeg,jpg,png}',
          dest: '<%%= config.dist %>/images',
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= config.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%%= config.dist %>/images',
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          conservativeCollapse: true,
          removeAttributeQuotes: true,
          removeCommentsFromCDATA: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
        },
        files: [{
          expand: true,
          cwd: '<%%= config.dist %>',
          src: '{,*/}*.html',
          dest: '<%%= config.dist %>',
        }]
      }
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care
    // of minification. These next options are pre-configured if you do not
    // wish to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%%= config.dist %>/styles/main.css': [
    //         '<%%= config.tmp %>/styles/{,*/}*.css',
    //         '<%%= config.app %>/styles/{,*/}*.css',
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%%= config.dist %>/scripts/scripts.js': [
    //         '<%%= config.dist %>/scripts/scripts.js',
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= config.app %>',
          dest: '<%%= config.dist %>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.webp',
            '{,*/}*.html',
            'styles/fonts/{,*/}*.*',
          ]
        }, {
          src: 'node_modules/apache-server-configs/dist/.htaccess',
          dest: '<%%= config.dist %>/.htaccess',
        }<% if (includeBootstrap) { %>, {
          expand: true,
          dot: true,
          cwd: '<% if (includeSass) {
              %>.<%
            } else {
              %>bower_components/bootstrap/dist<%
            } %>',
          src: '<% if (includeSass) {
              %>bower_components/bootstrap-sass-official/assets/fonts/bootstrap/*<%
            } else {
              %>fonts/*<%
            } %>',
          dest: '<%%= config.dist %>',
        }<% } %><% if (includeHandlebars) {  %>, {
          expand: true,
          dot: true,
          cwd: '<%%= config.tmp %>',
          src: ['{,*/}*.html'],
          dest: '<%%= config.dist %>',
        }<% } %>]
      },
      styles: {
        expand: true,
        dot: true,
        cwd: '<%%= config.app %>/styles',
        dest: '<%%= config.tmp %>/styles/',
        src: '{,*/}*.css',
      }
    },<% if (includeModernizr) { %>

    // Generates a custom Modernizr build that includes only the tests you
    // reference in your app
    modernizr: {
      dist: {
        devFile: 'bower_components/modernizr/modernizr.js',
        outputFile: '<%%= config.dist %>/scripts/vendor/modernizr.js',
        files: {
          src: [
            '<%%= config.dist %>/scripts/{,*/}*.js',
            '<%%= config.dist %>/styles/{,*/}*.css',
            '!<%%= config.dist %>/scripts/vendor/*',
          ]
        },
        uglify: true
      }
    },<% } %>

    // Run some tasks in parallel to speed up build process
    concurrent: {
      server: [<% if (includeSass) { %>
        'sass:server',<% } if (babel) {  %>
        'babel:dist',<% } %>
        'copy:styles',
      ],
      test: [<% if (babel) { %>
        'babel',<% } %>
        'copy:styles'
      ],
      dist: [<% if (babel) { %>
        'babel',<% } if (includeSass) { %>
        'sass',<% } %>
        'copy:styles',
        'imagemin',
        'svgmin',
      ]
    }<% if (includeHandlebars) { %>,

    // Compile Handlebars files into html
    assemble: {
      options: {
        flatten: true,
        partials: ['<%%= config.app %>/_includes/**/*.hbs'],
        layout: ['<%%= config.app %>/_layouts/default.hbs'],
      },
      server: {
        src: ['<%%= config.app %>/*.hbs'],
        dest: '<%%= config.tmp %>/',
      },
      dist: {
        src: ['<%%= config.app %>/*.hbs'],
        dest: '<%%= config.tmp %>/',
      }
    },<% } %><% if (includeSprites) { %>

    // Create css sprites
    sprite: {
      server: {
        src: '<%%= config.app %>/images/icons/*.png',
        dest: '<%%= config.tmp %>/images/generated/sprites.png',
        destCss: '<%%= config.tmp %>/styles/_sprites.scss',
        cssVarMap: function(sprite) {
          sprite.name = 'icon-' + sprite.name;
        }
      },
      dist: {
        src: '<%%= config.app %>/images/icons/*.png',
        dest: '<%%= config.dist %>/images/generated/sprites.png',
        destCss: '<%%= config.tmp %>/styles/sprites.scss',
        imgPath: '../images/generated/sprites.png',
        cssVarMap: function(sprite) {
          sprite.name = 'icon-' + sprite.name;
        }
      }
    }<% } %>
  });

  grunt.registerTask('serve', 'start the server and preview your app', function(target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'browserSync:dist']);
    }

    grunt.task.run([
      'clean:server',<% if (includeSprites) {  %>
      'sprite:server',<% } %>
      'wiredep',<% if (includeHandlebars) {  %>
      'assemble:server',<% } %>
      'concurrent:server',
      'cssnext',
      'browserSync:livereload',
      'watch',
    ]);
  });

  grunt.registerTask('test', function(target) {
    if (target !== 'watch') {
      grunt.task.run([
        'clean:server',
        'concurrent:test',
        'cssnext',
      ]);
    }

    grunt.task.run([
      'browserSync:test',<% if (testFramework === 'mocha') { %>
      'mocha',<% } else if (testFramework === 'jasmine') { %>
      'jasmine',<% } %>
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'wiredep',<% if (includeSprites) {  %>
    'sprite:dist',<% } %><% if (includeHandlebars) {  %>
    'assemble:dist',<% } %>
    'useminPrepare',
    'concurrent:dist',
    'cssnext',
    'concat',
    'cssmin',
    'uglify',
    'copy:dist',<% if (includeModernizr) { %>
    'modernizr',<% } %>
    'rev',
    'usemin',
    'htmlmin',
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build',
  ]);
};
