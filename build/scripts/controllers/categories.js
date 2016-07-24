'use strict';

System.register([], function (_export, _context) {
	"use strict";

	var _createClass, categories;

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	return {
		setters: [],
		execute: function () {
			_createClass = function () {
				function defineProperties(target, props) {
					for (var i = 0; i < props.length; i++) {
						var descriptor = props[i];
						descriptor.enumerable = descriptor.enumerable || false;
						descriptor.configurable = true;
						if ("value" in descriptor) descriptor.writable = true;
						Object.defineProperty(target, descriptor.key, descriptor);
					}
				}

				return function (Constructor, protoProps, staticProps) {
					if (protoProps) defineProperties(Constructor.prototype, protoProps);
					if (staticProps) defineProperties(Constructor, staticProps);
					return Constructor;
				};
			}();

			categories = function () {
				function categories() {
					_classCallCheck(this, categories);
				}

				_createClass(categories, [{
					key: '__constructor',
					value: function __constructor() {
						this.currentView = 'listing';
						this.helpers = {
							mode: 'new'
						};
						this.form = {
							name: '',
							validates: true
						};
					}
				}], [{
					key: 'showListing',
					value: function showListing() {
						this.currentView = 'listing';
					}
				}, {
					key: 'showForm',
					value: function showForm() {
						this.currentView = 'form';
					}
				}, {
					key: 'delete',
					value: function _delete(e, i) {
						view.categories.splice(i.index, 1);
						return true;
					}
				}, {
					key: 'saveForm',
					value: function saveForm() {
						view.category.form.name = view.category.form.name.trim().toLowerCase();
						view.category.form.validates = true;
						// validate category name
						if (view.category.form.name.length === 0 || pg.getCategoryByName(view.category.form.name) !== -1) view.category.form.validates = false;
						if (!view.category.form.validates) return false;

						// create category
						view.categories.push({
							id: pg.createGuid(),
							name: view.category.form.name,
							feeds: 0
						});

						// reset input
						view.category.form.name = '';
						view.category.form.validates = true;
						return true;
					}
				}]);

				return categories;
			}();

			_export('default', categories);
		}
	};
});
//# sourceMappingURL=categories.js.map
