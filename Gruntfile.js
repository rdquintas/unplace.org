//123

module.exports = function(grunt) {
    var _js_libs = [
        'bower_components/jquery/dist/jquery.min.js',
        'bower_components/handlebars/handlebars.min.js',
        'bower_components/packery/dist/packery.pkgd.min.js',
        'bower_components/slick-carousel/slick/slick.min.js'
        // 'js/src/libs/jquery.history.js',                    
        // 'js/src/libs/imagesloaded.pkgd.min.js',
        // 'js/src/libs/jquery.easing.1.3.js',
        // 'js/src/libs/path.min.js'
    ];

    var _js_custom = [
        'js/translations.js',
        'js/app.js'
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
            // options: {
            //     stripBanners: true,
            //     banner: '/*! Build Date: ' + '<%= grunt.template.today("yyyy-mm-dd") %> */'
            // },
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
            // js_libs: {
            //     src: 'js/libs.dist.js',
            //     dest: 'js/libs.dist.js'
            // },
            js_custom: {
                src: 'js/app.dist.js',
                dest: 'js/app.dist.js'
            }
        },


 
        // ================================
        // less: LESS compilation
        // ================================  
        less: {
            css_custom: {
                files: {
                    'css/app.dist.css': 'less/start_here.less'
                }
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
                    'concat:js_custom'
                ],
                options: {
                    event: ['all'],
                    interrupt: true
                }
            },
            css_custom: {
                files: "less/*.less",
                tasks: [
                    'less:css_custom'
                    // 'libsass:css_custom',
                    // 'cssmin:css_custom'
                ],
                options: {
                    event: ['all'],
                    interrupt: true
                }
            }
        },

        // // ================================
        // // copy: Copy files
        // // ================================  
        copy: {
            purecss: {
                src: 'bower_components/pure/pure-min.css',
                dest: 'css/pure-min.css'
            }
        },
    });


    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');


     // ================================
    // Task:    default
    // ================================
    grunt.registerTask('default', [
        'concat:js_libs',
        // 'uglify:js_libs',
        'jshint:js_custom',
        'concat:js_custom',
        // 'uglify:js_custom',
        'less:css_custom',
        'copy:purecss'
        // 'cssmin:css_custom'
    ]);

    // // ================================
    // // Task:    prod
    // // ================================    
    // grunt.registerTask('prod', [
    //     'concat:js_libs',
    //     // 'uglify:js_libs',
    //     'jshint:js_custom',
    //     'concat:js_custom',
    //     'uglify:js_custom',
    //     // 'libsass:css_custom',
    //     'copy:purecss',
    //     'cssmin:css_custom'
    // ]);

};
