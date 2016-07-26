'use strict';

System.register([], function (_export, _context) {
	"use strict";

	var feeds;
	return {
		setters: [],
		execute: function () {
			feeds = {
				__constructor: function __constructor() {
					feeds.feeds = app.feeds;

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
				},


				test: 'fdkmfskgfs',

				asd: [23, 45, 24, 64, 24],

				showListing: function showListing() {},
				showFormData: function showFormData() {
					//
					this.currentView = 'form:data';
				},
				showFormConfig: function showFormConfig() {
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
				},
				saveForm: function saveForm() {
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
			};

			_export('default', feeds);
		}
	};
});
//# sourceMappingURL=feeds.js.map
