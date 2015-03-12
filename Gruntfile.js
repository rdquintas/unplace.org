module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // ================================
        // clean: Deletes files
        // ================================          
        clean: ['js/<%= pkg.name %>.js'],


        // ================================
        // jshint: JS Hint
        // ================================          
        jshint: {
            dev: {
                src: ['js/src/*.js']
            }
        },


        // ================================
        // concat: Concatenation
        // ================================          
        concat: {
            options: {
                stripBanners: true,
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            js_libs: {
                src: [
                    'js/src/libs/739bf436-1824-4067-a456-9bd34cfd8f44.js',
                    'js/src/libs/jquery-1.11.2.min.js',
                    'js/src/libs/handlebars-v2.0.0.js',
                    'js/src/libs/imagesloaded.pkgd.min.js',
                    'js/src/libs/packery.pkgd.min.js',
                    'js/src/libs/path.min.js'
                ],
                dest: 'js/<%= pkg.name %>.libs.js'
            },
            js_custom: {
                src: [
                    'js/src/*.js'
                ],
                dest: 'js/<%= pkg.name %>.js'
            },
            css: {
                src: [
                    'css/src/*.css'
                ],
                dest: 'css/<%= pkg.name %>.min.css'
            }
        },


        // ================================
        // rename: Rename files
        // ================================          
        rename: {
            js: {
                files: [{
                    src: 'js/<%= pkg.name %>.js',
                    dest: 'js/<%= pkg.name %>.min.js'
                }]
            },
            css: {
                files: [{
                    src: 'css/<%= pkg.name %>.css',
                    dest: 'css/<%= pkg.name %>.min.css'
                }]
            }
        },


        // ================================
        // uglify: JS minify
        // ================================  
        uglify: {
            js: {
                src: 'js/<%= pkg.name %>.js',
                dest: 'js/<%= pkg.name %>.min.js'
            }
        },


        // ================================
        // cssmin: CSS minify
        // ================================        
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'css',
                    src: ['*.css'],
                    dest: 'css'
                        // ext: '<%= pkg.name %>.min.css'
                }]
            }
        },


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
        // watch: WATCH me now
        // ================================          
        watch: {
            scripts: {
                files: ['css/src/*.css', 'js/src/*.js'],
                tasks: ['dev'],
                options: {
                    event: ['all'],
                    interrupt: true
                }
            }
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


    // ================================
    // Task: 	default
    // ================================
    grunt.registerTask('default', [
        'watch'
    ]);


    // ================================
    // Task: 	http
    // ================================
    grunt.registerTask('http', [
        'connect'
    ]);


    // ================================
    // Task: 	dev
    // JS: 		jshint, concat
    // CSS: 	concat
    // ================================
    grunt.registerTask('dev', [
        'jshint:dev',
        'concat:css',
        'rename:css',
        'concat:js_libs',
        'concat:js_custom',
        'rename:js'
    ]);


    // ================================
    // Task: 	prod
    // JS: 		jshint, concat, minify
    // CSS: 	concat, minify
    // ================================    
    grunt.registerTask('prod', [
        'jshint:dev',
        'concat:css',
        'cssmin:target',
        'concat:js_libs',
        'concat:js_custom',
        'uglify:js',
        'clean'
    ]);
};
