'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , rivets , sightglass */

var pg = {
	/**
  * [config description]
  * @type {Object}
  */
	config: {
		baseUrl_import: '/',
		baseUrl_controller: 'scripts/controllers/',
		baseUrl_model: 'scripts/models/',
		baseUrl_module: 'scripts/pg-modules/',
		imports_constructor: '__constructor'
	},
	/**
  * [initialize description]
  * @return {[type]} [description]
  */
	initialize: function initialize() {
		pg.log('pg.initialize() : Pomegranade Object constructed. Initializing (pg.readyState="interactive")');
		pg.readyState = 'interactive';
		/* ES6 polyfill */
		pg.require('imports/babel-polyfill/polyfill.min.js', 'Babel Polyfill...')
		// System js (import modules from the future)
		.then(function (r) {
			return pg.require('imports/systemjs/system.js', 'SystemJS...');
		})
		/* Sightglass ... data binding */
		.then(function (r) {
			return pg.require('imports/sightglass/index.js', 'Sightglass...');
		})
		/* Rivers data binding....*/
		.then(function (r) {
			return pg.require('imports/rivets/rivets.js', 'Rivets...');
		})
		/* rivets expansion */
		.then(function (r) {
			return pg.require('lib/rivets.stdlib.js', 'Rivets Formaters Lib...');
		})
		/* rivets model and views importer */
		.then(function (r) {
			return pg.require('lib/rivets-import-view-model.js', 'Rivets Model Importer Lib...');
		})
		/* modules configurations  */
		.then(function (r) {
			pg.log('pg.initialize() : Configure Rivets & Rivets Model Importer...');
			System.config({ baseURL: pg.config.baseUrl_import });
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
				onLoadController: pg.load._onRivetsLoadController,
				baseUrl: pg.config.baseUrl_controller,
				constructor: pg.config.imports_constructor
			});
			pg.log('pg.initialize() : Integrate Binder in Pomegranade...');
			sightglass.adapters = rivets.adapters;
			sightglass.root = rivets.rootInterface;
			/* Ready ! Load main module */
			pg.log('pg.initialize() : Done! Pomegranade Ready! (pg.readyState="complete")');
			pg.log('----------------------------------------------------------------------');
			pg.readyState = 'complete';
			while (pg._readyCallbacks.length) {
				pg._readyCallbacks.shift()();
			}
		});
		return true;
	},
	/**
  * [ready description]
  * @param  {Function} callback [description]
  * @return {[type]}            [description]
  */
	ready: function ready(callback) {
		if (pg.readyState !== 'complete' || pg._readyCallbacks.length > 0) pg._readyCallbacks.push(callback);else callback();
		return true;
	},
	readyState: 'loading',
	_readyCallbacks: [],
	/**
  * [load description]
  * @type {Object}
  */
	load: {
		path_toArray: function path_toArray() {
			var p = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

			// generate array from path and remove empty keys (caused by double // or ending /)
			return p.split('/').filter(function (n) {
				return n === undefined || n === '' ? false : true;
			});
		},
		path_toObject: function path_toObject() {
			var p = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
			var obj = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
			var canWrite = arguments.length <= 2 || arguments[2] === undefined ? true : arguments[2];

			var arrayPath = pg.load.path_toArray(p);
			// extract las item (module name reference)
			var key = arrayPath.pop();
			// resolve module object instance path
			var namespace = arrayPath.reduce(function (o, i) {
				if (o === false || o[i] === undefined && !canWrite) return false;
				if (o[i] === undefined) o[i] = {};
				return o[i];
			}, obj);
			namespace[key] = _typeof(namespace[key]) === 'object' ? namespace[key] : canWrite ? {} : namespace[key];

			return {
				path: p,
				root: obj,
				key: key,
				namespace: namespace,
				object: namespace[key]
			};
		},

		_loaded: {
			module: {},
			model: {},
			controller: {}
		},
		_onRivetsLoadController: function _onRivetsLoadController(controllerName) {
			pg.controllers[controllerName] = rivets.imports[controllerName];
			if (!pg.load._loaded['controller'].hasOwnProperty(controllerName)) pg.load._loaded['controller'][controllerName] = 1;else pg.load._loaded['controller'][controllerName]++;
		},
		_load: function _load() {
			var itemType = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
			var itemsList = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
			var containerObj = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];
			var returnArray = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

			pg.log('pg.load.' + itemType + '() : *** PREPARING TO LOAD ' + itemsList.length + ' ' + itemType + '(s)...');
			// return promise
			return new Promise(function (resolve_callback) {
				var results = [];
				// store loaded item object
				var _constructed = function _constructed(item, _resolve) {
					delete item.__constructor; // ensure one time execution
					return _resolve(item);
				};
				// loader function
				var _loader = function _loader() {
					var itemName = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

					pg.log('pg.load.' + itemType + '() : Loading ' + itemType + ' : ' + itemName);
					return new Promise(function (_resolve) {
						//
						//
						// IMPORT ITEM
						if (!pg.load._loaded[itemType].hasOwnProperty(itemName)) pg.load._loaded[itemType][itemName] = 1;else {
							pg.log('pg.load.' + itemType + '() : The ' + itemType + ' ' + itemName + ' is already loaded. Using active Instance');
							pg.load._loaded[itemType][itemName]++;
							return _resolve(pg.load.path_toObject(itemName, containerObj, false));
						}
						System.import(pg.config['baseUrl_' + itemType] + itemName + '.js').then(function (item) {
							//
							//
							// GENERATE ITEM INSTANCE
							// resolve item path into container object, creating tree if required
							if (itemType === 'controller') rivets.imports[itemName] = item.default;
							var objPath = pg.load.path_toObject(itemName, containerObj);
							// if item is a function assign to resolution path, if is an object, mix with existent object
							if (typeof item.default === 'function') objPath.namespace[objPath.key] = item.default;else objPath.object = Object.assign(objPath.object, item.default);
							//
							//
							// EXECUTE CONSTRUCTOR
							// check if has custom constructor/igniter
							if (objPath.object.hasOwnProperty(pg.config.imports_constructor) && typeof objPath.object[pg.config.imports_constructor] === 'function') {
								pg.log('pg.load.' + itemType + '() : Executing ' + itemName + ' constructor.', 'info');
								// execute CONTROLLER module custom constructor
								var _c = objPath.object[pg.config.imports_constructor].call(objPath.object);
								// resolve pg.loadController (handle promise in CONTROLLER module __constructor)
								if ((typeof _c === 'undefined' ? 'undefined' : _typeof(_c)) === 'object' && typeof _c.then === 'function') {
									pg.log('pg.load.' + itemType + '() : Detected Promise in ' + itemName + ' Constructor. Waiting resolution...', 'info');
									return _c.then(function (x) {
										return _constructed(objPath.object, _resolve);
									});
								} else {
									return _constructed(objPath.object, _resolve);
								}
							} else return _constructed(objPath.object, _resolve);
						});
					});
				};
				// promise sequential iterator
				function _next() {
					_loader(itemsList.shift()).then(function (r) {
						results.push(r);
						if (itemsList.length === 0) resolve_callback(returnArray ? results : results[0]);else _next();
					});
				}
				// start iteration
				_next();
			});
		},
		model: function model() {
			var items = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

			// if more than one module has been requested, or single item has been requested inside array, return array
			var returnArray = arguments.length > 1 || Array.isArray(items) ? true : false;
			// force items to be an array
			items = Array.isArray(items) ? items : Array.prototype.slice.call(arguments);
			// start load
			return pg.load._load('model', items, pg.models, returnArray);
		},
		controller: function controller() {
			var items = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

			// if more than one module has been requested, or single item has been requested inside array, return array
			var returnArray = arguments.length > 1 || Array.isArray(items) ? true : false;
			// force items to be an array
			items = Array.isArray(items) ? items : Array.prototype.slice.call(arguments);
			// start load
			return pg.load._load('controller', items, pg.controllers, returnArray);
		},
		module: function module() {
			var items = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];

			// if more than one module has been requested, or single item has been requested inside array, return array
			var returnArray = arguments.length > 1 || Array.isArray(items) ? true : false;
			// force items to be an array
			items = Array.isArray(items) ? items : Array.prototype.slice.call(arguments);
			// start load
			return pg.load._load('module', items, pg, returnArray);
		},

		view: {},
		html: {},
		css: {}
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

	configure: function configure(obj) {},

	/**
  * [loadView description]
  * @param  {[type]} viewId [description]
  * @return {[type]}        [description]
  */
	loadView: function loadView(viewId) {
		alert("pg.loadView() : just for testing");
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
  * [controller description]
  * @type {Object}
  */
	views: {},
	models: {},
	controllers: {},
	/**
  * [description]
  * @param  {[type]} )
  * @return {[type]}   [description]
  */

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
		for (var model in rivets.imports) {
			if (!rivets.imports.hasOwnProperty(model)) continue;
			console.log(model);
			for (var view in rivets.imports[model].__views__) {
				if (!rivets.imports[model].__views__.hasOwnProperty(view)) continue;
				rivets.imports[model].__views__[view].unbind();
				delete rivets.imports[model].__views__[view];
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
			var description = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];

			pg.log('pg.require() :' + description + ' ' + src);
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
  * [createGuid description]
  * @return {[type]} [description]
  */
	guid: function guid() {
		function S4() {
			return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
		}
		// then to call it, plus stitch in '4' in the third group
		return (S4() + S4() + '-' + S4() + '-4' + S4().substr(0, 3) + '-' + S4() + '-' + S4() + S4() + S4()).toLowerCase();
	}
};

if (document.readyState === 'complete' || document.readyState === 'interactive') pg.initialize();else document.addEventListener('DOMContentLoaded', pg.initialize);
//# sourceMappingURL=pomegranade.js.map
