module.exports = function(grunt) {
	'use strict';

	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-increase');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-output');
	grunt.loadNpmTasks('grunt-auto-install');
	grunt.loadNpmTasks('grunt-contrib-compass');


	// Declaration of each node Module Package...
	const nodeModule = {
		fontAwesome 	: { cwd : 'node_modules/font-awesome/'			, src: ['css/**' , 'fonts/**'] 		, dest: 'src/styles/imports/font-awesome/'		, expand: true },
		rivets 			: { cwd : 'node_modules/rivets/dist/'			, src: ['rivets.js'] 				, dest: 'src/scripts/imports/rivets/' 			, expand: true },
		sightglass		: { cwd : 'node_modules/sightglass/'			, src: ['index.js'] 				, dest: 'src/scripts/imports/sightglass/' 		, expand: true },
		systemjs 		:{ cwd : 'node_modules/systemjs/dist/'			, src: ['system.js'] 				, dest: 'src/scripts/imports/systemjs/'			, expand: true }
	};
	// Automatic generations ...
	const src_PATH_nodeModules = Object.keys(nodeModule).map( i=> nodeModule[i].dest );
	const nodeModules_TO_src = Object.keys(nodeModule).map( i=> nodeModule[i] );



	grunt.initConfig({
	    /*
	    /* EXECUTE automatic 'npm -install'
	    */
	    auto_install: { npm : { /*no config needed*/ } },
		/*
		/* ¿ GRUNT-OUTPUT install FAILS ? :
		/* Manual Patch Required! Details in following link:
		/* https://github.com/lucaslopez/grunt-output/commit/6b66c0db5826ec04646709a6957d4eab96e2b414
		/* Until developer publishes the upgrade on npm, follow this steps  :
		/*
		/* 1- 	In <repositoy_root>/node_modules/grunt-output/package.json - line 38 (peerDependencies)
		/* 		"grunt": "~0.4.5"
		/* 		--must be replaced with--
		/* 		"grunt": ">=0.4.0"
		/* 2- 	After save, execute in console (with prompt in <repositoy_root>/node_modules/grunt-output/)
		/* 		npm cache clear
		/* 		npm install
		/* 		...to allow plugin dependencies being completely installed
		/* 3-	Return to repository root folder, and execute:
		/* 		npm cache clear
		/* 		npm install
		/* 		...to acomplish a complete package installation
		/* 		DONE! Fancy messages on Grunt are back!
		*/
		output: {
		    divider: {
				before : { mode : 'log', func : 'writeln', text : '' },
		    	content : { mode : 'log', func : 'writeln', color : 'magenta', styles:['bold'], before : '* ' },
	      		after : { mode : 'log', func : 'writeln', color : 'magenta',  styles:['bold'], text : '************************************************************' }
	    	}
		},
		/*
		/* INCREASE by 1 the selected counter of a 'major.minor.micro' type Version
		/* string (eg: 1.6.54). Only targets JSON files, with a 'version' property.
		*/
		increase: {
			major_IN_package 	: { degree: 1, json:  'package.json' 		},
			major_IN_manifest 	: { degree: 1, json:  'src/manifest.json' 	},
			//
			minor_IN_package 	: { degree: 2, json:  'package.json' 		},
			minor_IN_manifest 	: { degree: 2, json:  'src/manifest.json' 	},
			//
			micro_IN_package 	: { degree: 3, json:  'package.json' 		},
			micro_IN_manifest 	: { degree: 3, json:  'src/manifest.json' 	}
		},
		/*
		/* DELETE
		*/
		clean: {
			build_all			: { src: ['build/'] 				},
			build_scripts		: { src: ['build/scripts/**/*.js'] 	},
			build_scripts_es6 	: { src: ['build/scripts/**/*.es6'] },
			build_html			: { src: ['build/html/'] 			},
			build_styles		: { src: ['build/styles/'] 			},
			build_styles_scss	: { src: ['build/styles/**/*.scss'] 			},
			src_nodeModules 	: { src: src_PATH_nodeModules 		}
		},
		/* COPY */
		copy: {
			nodeModules_TO_src :{
				files:  nodeModules_TO_src
			},
		  	src_TO_build: {
		    	files: [ {expand: true, cwd: 'src/', src: ['**'], dest: 'build/'} ]
		  	},
		  	src_scripts_TO_build: {
		    	files: [ {expand: true, cwd: 'src/scripts/', src: ['**'], dest: 'build/scripts/'} ]
		  	},
		  	src_html_TO_build: {
		  		files: [ {expand: true, cwd: 'src/html/', src: ['**'], dest: 'build/html/'} ]
		  	},
		  	src_styles_TO_build: {
		  		files: [ {expand: true, cwd: 'src/styles/', src: ['**'], dest: 'build/styles/'} ]
		  	},
		  	src_manifest_TO_build: {
		  		files: [ {expand: true, cwd: 'src/', src: ['manifest.json'], dest: 'build/'} ]
		  	}
		},
		/* JS ES6 TRANSPILER */
	    babel : {
		    options: {
		    	babelrc: '.babelrc' ,
		    	sourceMap: true,
		    },
		    build_scripts_TRANSPILE_es6: {
		        files: [
		        	{
		        		expand: true,
		        		cwd: 'build/scripts/',
		        		dest: 'build/scripts/',
		        		src: ['**/*.es6'],
						ext: '.js',
						extDot: 'last'
		        	}
		        ]
		    }
		},
		compass: {
			src_styles_scss_TO_build: {
				options: {
					sassDir: 'src/styles/',
					cssDir: 'build/styles/',
					importPath : 'src/styles/'
				}
			}
		},
	    watch: {
			src_scripts: {
				files: ['src/scripts/**/*'],
				tasks: [
					'output:divider:Watch Event (src_scripts)',
					'clean:build_scripts',
					'copy:src_scripts_TO_build',
					'babel:build_scripts_TRANSPILE_es6',
					'clean:build_scripts_es6',
					'versionUp.u',
					'notify_hooks'
				],
			},
			src_html : {
				files: ['src/html/**/*'],
				tasks: [
					'output:divider:Watch Event (src_html)',
					'clean:build_html',
					'copy:src_html_TO_build',
					'versionUp.u',
					'notify_hooks'
				]
			},
			src_styles : {
				files: ['src/styles/**/*'],
				tasks: [
					'output:divider:Watch Event (src_styles)',
					'clean:build_styles',
					'copy:src_styles_TO_build',
					'clean:build_styles_scss',
					'compass:src_styles_scss_TO_build',
					'versionUp.u',
					'notify_hooks'
				]
			},
			//
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
		},
		// EXECUTES IN PARALEL WATCHERS (with actvity log)
	    concurrent: {
	    	options: { logConcurrentOutput: true },
	        watches: ['watch:src_scripts', 'watch:src_html', 'watch:src_styles', 'notify_hooks']
	    },
		// LAUNCH A DESKTOP NOTIFICATION : READY
		notify_hooks: {
		    options: { enabled: true, title: 'Grunt Task Ready', success: true, duration: 4 }
		}
	});


	grunt.registerTask('versionUp.M', ['increase:major_IN_package', 'increase:major_IN_manifest', 'copy:src_manifest_TO_build']);
	grunt.registerTask('versionUp.m', ['increase:minor_IN_package', 'increase:minor_IN_manifest', 'copy:src_manifest_TO_build']);
	grunt.registerTask('versionUp.u', ['increase:micro_IN_package', 'increase:micro_IN_manifest', 'copy:src_manifest_TO_build']);


	// GRUNT MAIN TASK!
	grunt.registerTask('default', [
		'output:divider:Starting GRUNT automation...',
		// execute npm -install
		'auto_install:npm',
		// clean&copy project required nodeModules
		'clean:src_nodeModules',
		'copy:nodeModules_TO_src',
		// clean ./build/** and dump ./src data inside
		'clean:build_all',
		'copy:src_TO_build',
		// TRANSPILE es6 files, convert .js MODULES to UMD
		// and finally clean  ./build/scripts/ of es6 files,
		'babel:build_scripts_TRANSPILE_es6',
		'clean:build_scripts_es6',
		//
		'clean:build_styles_scss',
		'compass:src_styles_scss_TO_build',
		// increase compilation
		'versionUp.u',
		// run watches&notify
		'concurrent:watches'
		// ./build ready !
	]);
};
