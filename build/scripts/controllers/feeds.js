'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

var feeds = {
	__constructor: function __constructor() {
		pg.log('[Controller]:feeds.__constructor() : Initializating Feeds Controller');
		return new Promise(function (resolve) {
			pg.load.model('feeds', 'feedContents', 'categories').then(function (r) {
				return resolve();
			});
		});
	},


	location: 'feeds/list',

	initialize: function initialize() {
		// update available categories
		feeds.categories = pg.models.categories.page(0);
		feeds.list.initialize();
	},

	categories: [],

	list: {
		target: null,

		page: {
			current: 1, // current page
			total: 1, // total pages
			limit: 5, // limit of items
			order: 'DESC',
			sortBy: 'id',
			items: [],
			count: function count() {
				return feeds.list.page.total = Math.ceil(pg.models.feeds.page(0).length / feeds.list.page.limit);
			},
			update: function update() {
				feeds.list.page.count();
				feeds.list.page.set(feeds.list.page.current || 1);
				return true;
			},
			set: function set(num) {
				var modifier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

				num = num + modifier;
				// validate pageNum
				if (typeof num !== 'number' || num < 1) num = 1;else if (num > feeds.list.page.total) num = feeds.list.page.count();
				feeds.list.page.current = Math.floor(num);

				feeds.list.page.items = pg.models.feeds.page(feeds.list.page.current, feeds.list.page.limit);
				return true;
			}
		},

		initialize: function initialize() {
			var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'insert';

			feeds.list.page.set(1);
			feeds.list.show();
			return true;
		},

		show: function show() {
			feeds.list.page.update();
			feeds.location = 'feeds/list';
			return true;
		},

		show_deleteFeedDialog: function show_deleteFeedDialog(id) {
			feeds.list.target = pg.models.feeds.get(id);
			feeds.location = 'feeds/list_delete';
		},

		delete_feed: function delete_feed(id) {
			pg.models.feeds.delete(id);
			feeds.list.initialize();
		},

		getCategoryName: function getCategoryName(id) {}
	},

	form: {
		active: 'feedDeclarationForm',
		mode: 'insert', // | update
		error: false,
		title: {
			insert: 'New Feed :',
			update: 'Edit Feed :'
		},

		UI: {
			feedDeclarationForm: null,
			feedAssignationsForm: null,
			feedUrl: null
		},

		Data: {},

		initialize: function initialize() {
			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (id !== null) {
				// EDIT MODE DETECTED! ... get Feed Data
				var feed = pg.models.feeds.get(id);
				if (feed === -1) throw new Error('feeds.form.initialize(): Can\'t find Feed with ID : ' + id);
				feeds.form.mode = 'update';
				feeds.form.Data = feed;
			} else {
				// INSERT MODE DETECTED ... generate new Feed
				feeds.form.mode = 'insert';
				feeds.form.Data = pg.models.feeds.new();
			}

			feeds.form.error = false;
			feeds.location = 'feeds/form';
			feeds.form.show_feedDeclarationForm();
			return true;
		},

		show_feedDeclarationForm: function show_feedDeclarationForm() {
			feeds.form.active = 'feedDeclarationForm';
		},
		show_feedAssignationsForm: function show_feedAssignationsForm() {
			feeds.form.active = 'feedAssignationsForm';
		},

		validate_feedDeclarationForm: function validate_feedDeclarationForm() {
			pg.log('feeds.form.validate_feedDeclaration(): Validating Feed Declaration...');
			// reset previous form validations
			feeds.form.error = false;
			feeds.form.UI.feedUrl.setCustomValidity('');
			// validate form
			if (!feeds.form.UI.feedDeclarationForm.checkValidity()) {
				pg.log('feeds.form.validate_feedDeclaration(): Form validation failed...');
				feeds.form.error = 'Some fields require your attention.';
				return false;
			}
			// show loader
			pg.loader(feeds.form.UI.feedDeclarationForm).show('Validating Feed Source...');
			//
			// asyncronic feed url validation
			//
			pg.models.feedContents.get(feeds.form.Data.url).then(function (_feed) {
				// done! hide loader
				pg.loader(feeds.form.UI.feedDeclarationForm).hide();
				// block and return if failed
				if (!_feed) {
					pg.log('feeds.form.validate_feedDeclaration(): URL validation failed...');
					feeds.form.error = 'RSS Feed not found in URL.';
					feeds.form.UI.feedUrl.setCustomValidity('RSS Feed not found in URL.');
					return false;
				}
				// TO DO:
				//  - validate structure 'rss.channel.item'
				//  - validate item length > 0

				// store FEED ITEMS
				feeds.form.Data.__items = _feed.rss.channel.item;
				// succeed, get RSS feed item properties structure
				feeds.form.Data.fields.available = pg.models.feeds.getItemsProperties(_feed);
				// DONE ! show next FORM!
				feeds.form.show_feedAssignationsForm();
			});
		},

		validate_feedAssignationsForm: function validate_feedAssignationsForm() {
			pg.log('feeds.form.validate_feedAssignationsForm(): Validating Feed Assignations...');
			// reset previous form validations
			feeds.form.error = false;
			// validate form
			if (!feeds.form.UI.feedAssignationsForm.checkValidity()) {
				pg.log('feeds.form.validate_feedAssignationsForm(): Form validation failed...');
				feeds.form.error = 'Some fields require your attention.';
				return false;
			}
			pg.loader(feeds.form.UI.feedAssignationsForm).show('Validating Feed Assignations...');
			// save feed Data
			pg.models.feeds.save({
				id: feeds.form.Data.id,
				name: feeds.form.Data.name,
				url: feeds.form.Data.url,
				fields: {
					available: feeds.form.Data.fields.available,
					assignations: {
						title: feeds.form.Data.fields.assignations.title,
						magnet: feeds.form.Data.fields.assignations.magnet,
						url: feeds.form.Data.fields.assignations.url
					}
				},
				TTL: feeds.form.Data.TTL,
				categories: feeds.form.Data.categories,
				status: {
					lastCheck: new Date(),
					code: 200,
					details: undefined
				}
			}).then(function (r) {
				//  hide loader
				pg.loader(feeds.form.UI.feedAssignationsForm).hide();
				// DONE! display ending message!
				feeds.location = 'feeds/form_completed';
			});
			return true;
		}
	}
};

exports.default = feeds;
//# sourceMappingURL=feeds.js.map
