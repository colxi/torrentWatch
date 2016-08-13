'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

var app = void 0;

var feeds = {
	__constructor: function __constructor() {
		return new Promise(function (resolve) {
			pg.load.model('app').then(function (m) {
				app = m;
				resolve();
			});
		});
	},


	location: 'feeds/list',
	initialize: function initialize() {
		feeds.location = 'feeds/list';
	},

	list: {},

	form: {
		show: 'feedDeclarationForm',
		mode: 'insert', // | update
		title: {
			insert: 'New Feed :',
			update: 'Edit Feed :'
		},

		UI: {
			feedDeclarationForm: null,
			feedConfigurationForm: null,
			feedUrl: null
		},

		is_feedSourceValid: undefined,

		Data: {
			id: '',
			step: '1',
			name: '',
			url: 'https://yts.ag/rss',
			categories: [],
			TTL: 60,
			properties: [],
			formError: false
		},

		initialize: function initialize() {
			var mode = arguments.length <= 0 || arguments[0] === undefined ? 'insert' : arguments[0];

			feeds.location = 'feeds/form';
			feeds.form.Data.formError = false;

			if (mode === 'insert') {}
		},

		validate_feedSource: function validate_feedSource() {
			pg.log('feeds.form.validate_feedSource(): Validating RSS feed...');
			// reset previous form validations
			feeds.form.Data.formError = false;
			feeds.form.UI.feedUrl.setCustomValidity('');
			// validate form
			if (!feeds.form.UI.feedDeclarationForm.checkValidity()) {
				pg.log('feeds.form.validate_feedSource(): Form validation failed...');
				feeds.form.Data.formError = 'Some fields are invalid.';
				return false;
			}
			// show loader
			pg.loader(feeds.form.UI.feedDeclarationForm).show('Validating Feed...');

			// asncronic feed url validation
			app.getFeed(feeds.form.Data.url).then(function (result) {
				// done! hide loader
				pg.loader(feeds.form.UI.feedDeclarationForm).hide();
				// block and return if failed
				if (!result) {
					pg.log('feeds.form.validate_feedSource(): URL validation failed...');
					feeds.form.Data.formError = 'RSS Feed not found in URL.';
					feeds.form.UI.feedUrl.setCustomValidity('RSS Feed not found in URL.');
					return false;
				}
				// succeed, get RSS feed item properties
				for (var i in result.rss.channel.item[0]) {
					if (result.rss.channel.item[0].hasOwnProperty(i) && i.charAt(0).match(/[A-Z|a-z]/i)) this.helpers.feedProperties.push(i);
				}
				feeds.form.show = 'form/config';
			});
		},

		save_feedDefinition: function save_feedDefinition() {
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

	}
};

exports.default = feeds;
//# sourceMappingURL=feeds.js.map
