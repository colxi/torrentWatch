'use strict';

System.register([], function (_export, _context) {
	"use strict";

	var _createClass, feeds;

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

			feeds = function () {
				function feeds() {
					_classCallCheck(this, feeds);
				}

				_createClass(feeds, [{
					key: '__constructor',
					value: function __constructor() {
						this.currentView = 'listing';
						this.helpers = {
							feedProperties: [],
							mode: 'new'
						};
						this.form = {
							name: '',
							url: 'https://kat.cr/movies/?rss=1',
							categories: [],
							TTL: 60,
							properties: []
						};
					}
				}], [{
					key: 'showListing',
					value: function showListing() {}
				}, {
					key: 'showFormData',
					value: function showFormData() {
						//
						this.currentView = 'form:data';
					}
				}, {
					key: 'showFormConfig',
					value: function showFormConfig() {
						console.log('Validating RSS feed...');

						pg.getFeed(this.form.url).then(function (result) {
							console.log(result);

							this.helpers.feedProperties = [];
							this.form.properties = [];
							if (result === false) {
								alert('RSS invalid');
								return false;
							}

							this.currentView = 'form:config';
							for (var i in result.rss.channel.item[0]) {
								if (result.rss.channel.item[0].hasOwnProperty(i) && i.charAt(0).match(/[A-Z|a-z]/i)) this.helpers.feedProperties.push(i);
							}
						});
					}
				}, {
					key: 'saveForm',
					value: function saveForm() {
						var feed = {
							id: '',
							name: '',
							url: '',
							properies: [],
							TTL: 0,
							categories: []
						};

						feed.id = pg.createGuid();
						feed.name = this.form.name.trim();
						feed.url = this.form.url.trim();
						feed.categories = this.form.categories;
						feed.TTL = this.form.TTL;
						feed.properties = this.form.properties;

						view.feeds.push(feed);
						pg.countFeedsinAllCategories();
						return true;
					}
				}]);

				return feeds;
			}();

			_export('default', feeds);
		}
	};
});
//# sourceMappingURL=feeds.js.map
