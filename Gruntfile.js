module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			options: { 'force': false, 'no-write': false },
			//
			build_dir: { src: ['build/**'] },
			build_scripts:{ src: ['build/js/**/*.js'] }
		},
		copy: {
		  	all_to_build: {
		    	files: [ {expand: true, cwd: 'src/', src: ['**'], dest: 'build/'} ]
		  	},
		},
	    babel : {
		    options: { babelrc: ".babelrc" , sourceMap: true},
		    //
		    src_to_build: {
		        files: [ {expand: true, cwd: 'src/js/',  src: ['**/*.js'],  dest: 'build/js/'} ]
		    }
		},
	    watch: {
			src_scripts: {
				files: ['src/js/**/*.js'],
				tasks: ['babel'],
			},
			options: {
				'spawn': true,
				'interrupt': true,
				'debounceDelay': 500,
				'interval': 100,
				'event': 'all',
				'reload': false,
				'forever': true,
				'dateFormat': null,
				'atBegin': false,
				'livereload': false,
				'cwd': process.cwd(),
				'livereloadOnError': true
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', [
		'clean:build_dir',
		'copy:all_to_build',
		'clean:build_scripts',
		'babel:src_to_build',
		'watch:src_scripts'
	]);
};
