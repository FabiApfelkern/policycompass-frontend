// Generated on 2015-03-06 using generator-angular-fullstack 2.0.13
'use strict';

module.exports = function (grunt) {
    var localConfig;
    try {
        localConfig = require('./server/config/local.env');
    } catch (e) {
        localConfig = {};
    }

    // Load grunt tasks automatically, when needed
    require('jit-grunt')(grunt, {
        express: 'grunt-express-server',
        useminPrepare: 'grunt-usemin',
        cdnify: 'grunt-google-cdn',
        injector: 'grunt-asset-injector',
        buildcontrol: 'grunt-build-control'
    });

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        pkg: grunt.file.readJSON('package.json'),
        yeoman: {
            // configurable paths
            client: 'app',
            dist: 'dist'
        },

        express: {
            options: {
                port: process.env.PORT || 9000
            },
            dev: {
                options: {
                    script: 'server/app.js',
                    debug: true
                }
            },
            prod: {
                options: {
                    script: 'dist/server/app.js'
                }
            }
        },
        open: {
            server: {
                url: 'http://localhost:<%= express.options.port %>',
                app: 'google-chrome'
            }
        },
        watch: {
            injectJS: {
                files: [
                    '<%= yeoman.client %>/*.js',
                    '<%= yeoman.client %>/**/*.js'],
                tasks: ['injector:scripts']
            },
            injectCss: {
                files: [
                    '<%= yeoman.client %>/**/*.css'
                ],
                tasks: ['injector:css']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            livereload: {
                files: [
                    '{.tmp,<%= yeoman.client %>}/**/*.css',
                    '{.tmp,<%= yeoman.client %>}/**/*.html',
                    '{.tmp,<%= yeoman.client %>}/**/*.js'//,
                    //'<%= yeoman.client %>/{,*//*}*.{png,jpg,jpeg,gif,webp,svg,owl,jsonld}'
                ],
                options: {
                    livereload: true
                }
            },
            express: {
                files: [
                    'server/**/*.{js,json}'
                ],
                tasks: ['express:dev', 'wait'],
                options: {
                    livereload: true,
                    nospawn: true //Without this option specified express won't be reloaded
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: [
                        '.tmp',
                        '<%= yeoman.dist %>/*',
                        '!<%= yeoman.dist %>/.git*',
                        '!<%= yeoman.dist %>/.openshift',
                        '!<%= yeoman.dist %>/Procfile'
                    ]
                }]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '.tmp/',
                    src: '{,*/}*.css',
                    dest: '.tmp/'
                }]
            }
        },

        // Use nodemon to run server in debug mode with an initial breakpoint
        nodemon: {
            debug: {
                script: 'server/app.js',
                options: {
                    nodeArgs: ['--debug-brk'],
                    env: {
                        PORT: process.env.PORT || 9000
                    },
                    callback: function (nodemon) {
                        nodemon.on('log', function (event) {
                            console.log(event.colour);
                        });

                        // opens browser on initial server start
                        nodemon.on('config:update', function () {
                            setTimeout(function () {
                                require('open')('http://localhost:8080/debug?port=5858');
                            }, 500);
                        });
                    }
                }
            }
        },

        // Automatically inject Bower components into the app
        wiredep: {
            target: {
                src: '<%= yeoman.client %>/index.html',
                ignorePath: '<%= yeoman.client %>/',
                exclude: ['/json3/', '/es5-shim/', '/font-awesome.css/']
            }
        },

        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/public/{,*/}*.js',
                        '<%= yeoman.dist %>/public/{,*/}*.css',
                        '<%= yeoman.dist %>/public/img/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/public/assets/fonts/*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        useminPrepare: {
            html: ['<%= yeoman.client %>/index.html'],
            options: {
                dest: '<%= yeoman.dist %>/public'
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/public/{,*/}*.html'],
            css: ['<%= yeoman.dist %>/public/{,*/}*.css'],
            js: ['<%= yeoman.dist %>/public/{,*/}*.js'],
            options: {
                assetsDirs: [
                    '<%= yeoman.dist %>/public',
                    '<%= yeoman.dist %>/public/img'
                ],
                patterns: {
                    js: [
                        [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
                    ]
                }
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.client %>/img',
                    src: '{,*/}*.{png,jpg,jpeg,gif}',
                    dest: '<%= yeoman.dist %>/public/img'
                }]
            }
        },

        svgmin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= yeoman.client %>/img',
                    src: '{,*/}*.svg',
                    dest: '<%= yeoman.dist %>/public/img'
                }]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/public/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [{
                    expand: true,
                    dot: true,
                    cwd: '<%= yeoman.client %>',
                    dest: '<%= yeoman.dist %>/public',
                    src: [
                        '*.{ico,png,txt}',
                        '.htaccess',
                        //'bower_components/**/*',
                        'img/{,*/}*.{webp}',
                        'css/**/*',
                        'modules/**/*.css',
                        'assets/fonts/**/*',
                        'index.html'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/images',
                    dest: '<%= yeoman.dist %>/public/img',
                    src: ['generated/*']
                }, {
                    expand: true,
                    dest: '<%= yeoman.dist %>',
                    src: [
                        'package.json',
                        'server/**/*'
                    ]
                }, {
                    expand: true,
                    cwd: '.tmp/concat',
                    dest: '<%= yeoman.dist %>/public',
                    src: ['vendor.js', 'vendor.css']
                }]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.client %>',
                dest: '.tmp/',
                src: ['**/*.css']
            }
        },

        buildcontrol: {
            options: {
                dir: 'dist',
                commit: true,
                push: true,
                connectCommits: false,
                message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
            },
            heroku: {
                options: {
                    remote: 'heroku',
                    branch: 'master'
                }
            },
            openshift: {
                options: {
                    remote: 'openshift',
                    branch: 'master'
                }
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
            ],
            debug: {
                tasks: [
                    'nodemon'
                ],
                options: {
                    logConcurrentOutput: true
                }
            },
            dist: [
                'imagemin',
                'svgmin'
            ], options: {limit: 3}
        },

        env: {
            prod: {
                NODE_ENV: 'production'
            },
            all: localConfig
        },

        injector: {
            options: {},
            // Inject application script files into index.html (doesn't include bower)
            scripts: {
                options: {
                    transform: function (filePath) {
                        filePath = filePath.replace('/app/', '');
                        filePath = filePath.replace('/.tmp/', '');
                        return '<script src="' + filePath + '"></script>';
                    },
                    starttag: '<!-- injector:js -->',
                    endtag: '<!-- endinjector -->'
                },
                files: {
                    '<%= yeoman.client %>/index.html': [
                        [                            '{.tmp,<%= yeoman.client %>}/config.js',
                            '{.tmp,<%= yeoman.client %>}/app.js',
                            '{.tmp,<%= yeoman.client %>}/modules/**/*.js',]
                    ]
                }
            },

            // Inject component css into index.html
            css: {
                options: {
                    transform: function (filePath) {
                        filePath = filePath.replace('/app/', '');
                        filePath = filePath.replace('/.tmp/', '');
                        return '<link rel="stylesheet" href="' + filePath + '">';
                    },
                    starttag: '<!-- injector:css -->',
                    endtag: '<!-- endinjector -->'
                },
                files: {
                    '<%= yeoman.client %>/index.html': [
                        '<%= yeoman.client %>/**/*.css'
                    ]
                }
            }
        },
    });

    // Used for delaying livereload until after server has restarted
    grunt.registerTask('wait', function () {
        grunt.log.ok('Waiting for server reload...');

        var done = this.async();

        setTimeout(function () {
            grunt.log.writeln('Done waiting!');
            done();
        }, 1500);
    });

    grunt.registerTask('express-keepalive', 'Keep grunt running', function () {
        this.async();
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'env:all', 'env:prod', 'express:prod', 'wait', 'express-keepalive']);
        }

        if (target === 'debug') {
            return grunt.task.run([
                'clean:server',
                'env:all',
                'concurrent:server',
                'injector',
                'wiredep',
                'autoprefixer',
                'concurrent:debug'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'env:all',
            'concurrent:server',
            'injector',
            'wiredep',
            'autoprefixer',
            'express:dev',
            'wait',
            'watch'
        ]);
    });

    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('build', [
        'clean:dist',
        'concurrent:dist',
        'injector',
        'wiredep',
        'useminPrepare',
        'autoprefixer',
        'concat',
        'copy:dist',
        'uglify',
        'cdnify',
        'cssmin',
        'usemin',
    ]);

    grunt.registerTask('default', [
        'build'
    ]);
};
