/**
 * Created by trump.wang on 2014/8/13.
 */
module.exports = function(grunt){

    var gruntConfig = {};

    try{
        gruntConfig = require("./grunt-config.json") ;
    }catch (E){

    }

    var allJsFileArr = [
        'avril.js'
        , 'avril.tools.js'
        , 'avril.validator.js'
        , 'avril.ui.js'
        , 'avril.mvvm.js'
    ];

    grunt.initConfig({
        pkg: require('./package.json')
        , concat:{
            all:{
                src: allJsFileArr
                , dest: 'avril-release/avril.all.latest.js'
            }
            , production: {
                src: allJsFileArr,
                dest: 'avril-release/avril.all-<%=pkg.version%>.js'
            }
        }
        , uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */'
            },
            avril_min: {
                files: {
                    'avril-release/avril.all.latest.min.js': ['avril-release/avril.all.latest.js'],
                    'avril-release/avril.all.latest-<%=pkg.version%>.min.js': ['avril-release/avril.all.latest.js']
                }
            }
        }
        , watch: {
            scripts: {
                files: ['avril*.js','avril*.less'],
                tasks: ['default'],
                options: {
                    spawn: false
                }
            }
        }
        , less:{
            'release':{
                options: {
                    paths: [""]
                }
                , files: {
                    "avril-release/avril.css": "avril.less"
                }
            }
        }
    });

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });

    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.registerTask('default' , ['concat', 'uglify', "less" ] );

}