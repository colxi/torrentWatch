module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		clean: {
			task: {
				src: ['source'],
				dest: 'destination'
			},
			options: {
				'force': false,
				'no-write': false
			}
		},
		autoprefixer: {
			task: {
				src: ['source'],
				dest: 'destination'
			},
			options: {
				'browsers': ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1'],
				'cascade': true,
				'diff': false,
				'map': false,
				'silent': false
			}
		},
		sass: {
			task: {
				src: ['source'],
				dest: 'destination'
			},
			options: {
				'sourcemap': 'auto',
				'trace': false,
				'unixNewlines': false,
				'check': false,
				'style': 'nested',
				'precision': 3,
				'quiet': false,
				'compass': false,
				'debugInfo': false,
				'lineNumbers': false,
				'loadPath': [],
				'require': [],
				'cacheLocation': '.sass-cache',
				'noCache': false,
				'bundleExec': false,
				'banner': '',
				'update': false
			}
		},
		watch: {
			task: {
				src: ['source'],
				dest: 'destination'
			},
			options: {
				'spawn': true,
				'interrupt': false,
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
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['clean', 'autoprefixer', 'sass', 'watch']);
};
