module.exports = function(grunt) {
    var _js_libs = [
        'js/739bf436-1824-4067-a456-9bd34cfd8f44.js',
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/handlebars/handlebars.min.js',
        'bower_components/packery/dist/packery.pkgd.min.js'
        // 'js/src/libs/jquery.history.js',                    
        // 'js/src/libs/imagesloaded.pkgd.min.js',
        // 'js/src/libs/jquery.easing.1.3.js',
        // 'js/src/libs/path.min.js'
    ];

    var _js_custom = [
        'js/translations.js',
        'js/app.js'
    ];

    var _css_custom = [
        'sass/start_here.scss',
        'sass/gbnt.scss'
    ];


    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        // ================================
        // jshint: JS Hint
        // ================================          
        jshint: {
            js_custom: {
                src: _js_custom
            }
        },


        // ================================
        // concat: Concatenation
        // ================================          
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! Build Date: ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            js_libs: {
                src: _js_libs,
                dest: 'js/libs.dist.js'
            },
            js_custom: {
                src: _js_custom,
                dest: 'js/app.dist.js'
            }
        },


        // ================================
        // uglify: JS minify
        // ================================  
        uglify: {
            js_libs: {
                src: 'js/libs.dist.js',
                dest: 'js/libs.dist.js'
            },
            js_custom: {
                src: 'js/app.dist.js',
                dest: 'js/app.dist.js'
            }
        },


        // ================================
        // cssmin: CSS minify
        // ================================        
        cssmin: {
            css_custom: {
                files: {
                    'css/app.dist.css': ['css/app.dist.css']
                }
            }
        },

        // cssmin: {
        //   options: {
        //     shorthandCompacting: false,
        //     roundingPrecision: -1
        //   },
        //   target: {
        //     files: {
        //       'output.css': ['foo.css', 'bar.css']
        //     }
        //   }
        // }


        // ================================
        // compress: ZIP files
        // ================================
        compress: {
            main: {
                options: {
                    mode: "zip",
                    archive: '<%= pkg.name %>_v<%= pkg.version %>.zip'
                },
                files: [{
                    expand: true,
                    src: [
                        '**/**',
                        '!.git/**',
                        '!node_modules/**',
                        '!.gitignore',
                        '!Gruntfile.js',
                        '!package.json',
                        '!README.md'
                    ],
                    dest: '<%= pkg.name %>_v<%= pkg.version %>/'
                }]
            }
        },


        // ================================
        // libsass: SASS compilation
        // ================================  
        libsass: {
            css_custom: {
                src: 'sass/start_here.scss',
                dest: 'css/app.dist.css'
            }
        },


        // ================================
        // watch: WATCH me now
        // ================================          
        watch: {
            js_custom: {
                files: _js_custom,
                tasks: [
                    'jshint:js_custom',
                    'concat:js_custom',
                    'uglify:js_custom'
                ],
                options: {
                    event: ['all'],
                    interrupt: true
                }
            },
            css_custom: {
                files: _css_custom,
                tasks: [
                    'libsass:css_custom',
                    'cssmin:css_custom'
                ],
                options: {
                    event: ['all'],
                    interrupt: true
                }
            }
        },


        // ================================
        // clean: Deletes files
        // ================================          
        clean: ['js/<%= pkg.name %>.js'],


        // ================================
        // rename: Rename files
        // ================================          
        rename: {
            // css: {
            //     files: [{
            //         src: 'css/teste.css',
            //         dest: 'css/teste.min.css'
            //     }]
            // }
        },


        // ================================
        // connect: HTTP server
        // ================================
        connect: {
            server: {
                options: {
                    port: 8080,
                    keepalive: true
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-rename');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-libsass');


    // ================================
    // Task: 	default
    // ================================
    grunt.registerTask('default', [
        'concat:js_libs',
        'uglify:js_libs',
        'jshint:js_custom',
        'concat:js_custom',
        'uglify:js_custom',
        'libsass:css_custom',
        'cssmin:css_custom'
    ]);

    // ================================
    // Task: 	prod
    // JS: 		jshint, concat, minify
    // CSS: 	concat, minify
    // ================================    
    // grunt.registerTask('prod', [
    //     'jshint:dev',
    //     'concat:css',
    //     'cssmin:target',
    //     'concat:js_libs',
    //     'concat:js_custom',
    //     'uglify:js',
    //     'clean'
    // ]);
};
