'use strict';

/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , rivets , sightglass */

var pg = void 0;

(function () {
	'use strict';

	pg = {

		load: {
			model: function model(modelName) {
				return new Promise(function (_resolve) {
					_resolve(rivets.importedModels[modelName]);
				});
			},
			view: {},
			html: {}
		},
		loader: function loader() {
			var el = arguments.length <= 0 || arguments[0] === undefined ? document.body : arguments[0];

			return {
				show: function show() {
					var text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
					el.setAttribute('pg-loading', text);
				},
				hide: function hide() {
					el.removeAttribute('pg-loading');
				},
				text: function text() {
					var _text = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

					el.setAttribute('pg-loading', _text);
				},
				has: function has() {
					return el.hasAttribute('pg-loading');
				}
			};
		},
		/**
   * [configure description]
   * @param  {[type]} obj [description]
   * @return {[type]}     [description]
   */
		/*
  __Controller : class{
  constructor(name, module ) {
   			//module.__pg_controller = name; // ¿ injected native / babel ?
   			if(name === 'main') module.log = function(msg,type){ return pg.log(msg,type) };
   			module._expose = function(){
   				return Object.getOwnPropertyNames(module).filter( p => {
  			return( ['_expose','prototype'].indexOf(p) === -1);
  		});
  	};
   			return module;
  		}
  },
  */
		__Controller: function __Controller(name, module) {
			module.name = name;
			if (name === 'main') module.log = function (msg, type) {
				return pg.log(msg, type);
			};
			/*
   Object.defineProperty(module, '$scope', {
   	get: function () {
   		return Object.getOwnPropertyNames(module).filter( p => {
   			return( ['$scope','prototype'].indexOf(p) === -1) ? "add": false;;
   		});
   	}
   });
   */

			return module;
		},
		configure: function configure(obj) {},
		config: {
			importedModels_basePath: 'scripts/models/',
			importedModels_constructor: '__constructor',
			import_baseUrl: '/',
			appReference: 'app'
		},
		/**
   * [loadView description]
   * @param  {[type]} viewId [description]
   * @return {[type]}        [description]
   */
		loadView: function loadView(viewId) {
			var path = 'views/pages/' + viewId + '.html';
			return new Promise(function (_resolve) {
				var done = false;
				var _html = new XMLHttpRequest();
				_html.overrideMimeType('text/html');
				_html.open('GET', path, true);
				_html.onload = _html.onreadystatechange = function () {
					if (!done && (!this.readyState || this.readyState === 4)) {
						done = true;
						// free memory, explicit  listener removal;
						_resolve(_html.responseText);
						_html.onload = _html.onreadystatechange = null;
					}
				};
				_html.onerror = function () {
					_resolve(false);
				};
				_html.send(null);
			});
		},
		/**
   * [loadController description]
   * @param  {[type]} controller [description]
   * @return {[type]}            [description]
   */
		loadController: function loadController(controllerId) {
			pg.log('pg.loadController() : Loading controller module "' + controllerId + '"');
			return new Promise(function (_resolve, __reject) {
				//
				//
				// internal function used to end loadController routine, cleaning
				// CONTROLLER module and resolving promise...
				var __resolve_loadController = function __resolve_loadController() {
					if (controllerId === 'main') window[pg.config.appReference] = pg.controllers[controllerId];
					delete pg.controllers[controllerId].length; // babel transpiler autogen ¿?
					delete pg.controllers[controllerId].__constructor; // ensure one time executable
					_resolve(pg.controllers[controllerId]);
				};
				//
				//
				//
				// import CONTROLLER module
				System.import('/scripts/controllers/' + controllerId + '.js').then(function (controller) {
					// create CONTROLLER module instance
					// ****
					// RIVETS cant read ES6 classes (..or babel transpilation)
					// soo using standard objects in modules...
					// pg.controllers[controllerId] = new controller.default(controllerId,controller.default );
					// ****

					pg.controllers[controllerId] = new pg.__Controller(controllerId, controller.default);

					// check if has custom constructor/igniter
					if (pg.controllers[controllerId].hasOwnProperty('__constructor') && typeof pg.controllers[controllerId].__constructor === 'function') {
						// execute CONTROLLER module custom constructor
						var _c = pg.controllers[controllerId].__constructor.call(pg.controllers[controllerId]);
						// resolve pg.loadController (handle promise in CONTROLLER module __constructor)
						if (_c !== undefined && _c.hasOwnProperty('then') && typeof _c.then === 'function') _c.then(function (r) {
							return __resolve_loadController();
						});else __resolve_loadController();
					} else __resolve_loadController();
				});
			});
		},
		/**
   * [controller description]
   * @type {Object}
   */
		controllers: {},
		/**
   * [description]
   * @param  {[type]} )
   * @return {[type]}   [description]
   */
		_init: document.addEventListener('DOMContentLoaded', function () {
			/* ES6 polyfill */
			pg.log('pg._init() : Requiring Babel Polyfill...');
			pg.require('imports/babel-polyfill/polyfill.min.js').then(function () {
				// System js (import modules from the future)
				pg.log('pg._init() : Requiring SystmJS...');
				pg.require('imports/systemjs/system.js').then(function () {
					System.config({ baseURL: pg.config.import_baseUrl });
					/* Sightglass ... data binding */
					pg.log('pg._init() : Requiring Sightglass...');
					pg.require('imports/sightglass/index.js').then(function () {
						/* Rivers data binding on steroids....*/
						pg.log('pg._init() : Requiring Rivets...');
						pg.require('imports/rivets/rivets.js').then(function () {
							/* Steroids expansion */
							pg.log('pg._init() : Requiring Rivets Formaters Lib... ( rivets.stdlib )');
							pg.require('lib/rivets.stdlib.js').then(function () {
								pg.log('pg._init() : Requiring Rivets Model Importer Lib... ( rivets-import-view-model )');
								pg.require('lib/rivets-import-view-model.js').then(function () {
									pg.log('pg._init() : Configure Rivets & Rivets Model Importer...');
									// configure RIVETS
									rivets.configure({
										prefix: 'rv', // Attribute prefix in templates
										preloadData: true, // Preload templates with initial data on bind
										rootInterface: '.', // Root sightglass interface for keypaths
										templateDelimiters: ['{', '}'], // Template delimiters for text bindings
										// Augment the event handler of the on-* binder
										handler: function handler(target, ev, binding) {
											return this.call(target, event, binding.view.models, binding);
										}
									});
									rivets.configure_importer({
										basePath: pg.config.importedModels_basePath,
										constructor: pg.config.importedModels_constructor
									});
									pg.log('pg._init() : Integrate Bindser in Pomegranade...');
									sightglass.adapters = rivets.adapters;
									sightglass.root = rivets.rootInterface;
									/* Ready ! Load main module */
									pg.log('pg._init() : Done! Pomegranade Ready!');
									//let rv_view = pg.bind( document.querySelector('body') , { '_global' : {} } );

									//pg.log('pg._init() : Loading MAIN controller...');
									//pg.loadController('main').then( r =>{
									//	pg.log('pg._init() : Main Controller Loaded!');
									//});
								});
							});
						});
					});
				});
			});
		}),
		watch: function watch(el, key, callback, options) {
			return sightglass(el, key, callback, options);
		},
		bindings: {},
		bind: function bind(el, data) {
			var view = rivets.bind(el, data);
			var id = pg.guid();
			Object.defineProperty(view, '__pg_id__', { value: id, enumerable: false, writable: false, configurable: false });
			pg.bindings[id] = view;
			return id;
		},
		unbind: function unbind(id) {
			if (pg.bindings.hasOwnProperty(id)) {
				pg.bindings[id].unbind();
				delete pg.bindings[id];
				return true;
			} else {
				console.warn('pg.unbind() : Provided binding ID does not match to any previous registered binding.');
				return false;
			}
		},
		unbindAll: function unbindAll() {
			pg.log('pg.unbindAll(): Unbinding all bindings ( pg.bind and rv:model:import)...');
			// automatic bindings in model imports....
			for (var model in rivets.importedModels) {
				if (!rivets.importedModels.hasOwnProperty(model)) continue;
				console.log(model);
				for (var view in rivets.importedModels[model].__views__) {
					if (!rivets.importedModels[model].__views__.hasOwnProperty(view)) continue;
					rivets.importedModels[model].__views__[view].unbind();
					delete rivets.importedModels[model].__views__[view];
				}
			}
			// manual bindings in in pomegradade...
			for (var binding in pg.bindings) {
				if (!pg.bindings.hasOwnProperty(binding)) continue;
				console.log(binding);
				pg.unbind(binding);
			}
			return true;
		},
		chromeExt: {
			popupBinding: undefined,
			popupObserver: chrome.runtime.onConnect.addListener(function (port) {
				// popup OPEN
				pg.log('pg.chromeExt.popupObserver(): Popup opened!...');
				var document = chrome.extension.getViews({ type: 'popup' })[0].document;
				pg.chromeExt.popupBinding = pg.bind(document.querySelector('html'), {});

				// popup CLOSE listener
				var disconect = port.onDisconnect.addListener(function () {
					pg.unbindAll();
					pg.log('pg.chromeExt.popupObserver(): Popup closed!...');
					pg.chromeExt.popupBinding = null;
					disconect = null;
				});
			})
		},
		/**
   * [require description]
   * @param  {[type]} url [description]
   * @return {[type]}     [description]
   */
		require: function () {
			var config = {
				baseUrl: 'scripts/'
			};
			var _require = function _require(src) {
				return new Promise(function (_resolve, _reject) {
					var filename = src.substring(src.lastIndexOf('/') + 1);
					// if no extension, assume .JS and extract again the filenamename
					if (filename.lastIndexOf('.js') === -1) {
						src = src + '.js';
						filename = src.substring(src.lastIndexOf('/') + 1);
					}
					// Adding the script tag to the head
					var done = false;
					var head = document.getElementsByTagName('head')[0];
					var script = document.createElement('script');
					script.type = 'text/javascript';
					script.src = config.baseUrl + src;
					//pg.log(script.src);
					script.onload = script.onreadystatechange = function () {
						// attach to both events for cross browser finish detection:
						if (!done && (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete')) {
							// done! execute PROMISE _resolve
							done = true;
							// cleans up a little memory, removing listener;
							script.onload = script.onreadystatechange = null;
							_resolve();
						}
					};
					// Fire the loading
					head.appendChild(script);
				});
			};
			_require.config = function (custom_config) {
				Object.assign(config, custom_config);
				return true;
			};
			return _require;
		}(),
		/**
   * [feeds description]
   * @type {Array}
   */

		logStore: [],
		log: function log() {
			var msg = arguments.length <= 0 || arguments[0] === undefined ? '{empty}' : arguments[0];
			var method = arguments.length <= 1 || arguments[1] === undefined ? 'log' : arguments[1];

			pg.logStore.push(msg);
			console[method](msg);
			return true;
		},
		/**
   * [description]
   * @param  {[type]} ){ return
   * @return {[type]}     [description]
   */
		getManifest: function getManifest() {
			return chrome.app.getDetails();
		},
		getVersion: function getVersion() {
			return chrome.app.getDetails().version;
		},
		getCurrentLocale: function getCurrentLocale() {
			return chrome.app.getDetails().current_locale;
		},

		/**
   * [createGuid description]
   * @return {[type]} [description]
   */
		createGuid: function createGuid() {
			alert("use pg.gui!");
		},
		guid: function guid() {
			function S4() {
				return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
			}
			// then to call it, plus stitch in '4' in the third group
			return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
		}
	};
})();
//# sourceMappingURL=pg-core.js.map
