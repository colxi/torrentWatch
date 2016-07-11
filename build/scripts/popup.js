'use strict';

var chrome, rivets, view, app;

(function () {
	'use strict';

	view = {
		_init: document.addEventListener('DOMContentLoaded', function () {
			console.log('Popup opened!');
			app = chrome.extension.getBackgroundPage().app;
			view.categories = app.categories;
			view.feeds = app.feed;
			view.logStore = app.logStore;
			rivets.bind(document.querySelector('#app-wrapper'), { view: view });
		}),
		categories: null,
		feeds: null,
		logStore: null,
		//
		category: {
			form: {
				name: '',
				validates: true
			},
			add: function add() {
				view.category.form.name = view.category.form.name.trim().toLowerCase();
				view.category.form.validates = true;
				// validate category name
				if (view.category.form.name.length === 0 || app.getCategoryByName(view.category.form.name) !== -1) view.category.form.validates = false;
				if (!view.category.form.validates) return false;

				// create category
				view.categories.push({
					id: app.createGuid(),
					name: view.category.form.name,
					feeds: 0
				});

				// reset input
				view.category.form.name = '';
				view.category.form.validates = true;
				return true;
			},
			remove: function remove(e, i) {
				view.categories.splice(i.index, 1);
				return true;
			}
		},
		feed: {
			form: {
				step: 'form-data',
				name: {
					value: '',
					validates: true
				},
				url: {
					value: '',
					validates: false
				}
			},
			validate: function validate() {
				app.getFeed(view.feed.form.url.value).then(function (r) {
					return console.log(r);
				});
			}
		}

	};
})();
//# sourceMappingURL=popup.js.map
