'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */

var watchers = {
	__constructor: function __constructor() {
		return new Promise(function (resolve) {
			pg.load.model('watchers', 'categories').then(function (m) {
				return resolve(watchers.model = m);
			});
		});
	},


	location: 'watchers/list',

	initialize: function initialize() {
		watchers.categories = pg.models.categories.page(0);
		watchers.list.initialize();
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
				return watchers.list.page.total = Math.ceil(pg.models.watchers.page(0).length / watchers.list.page.limit);
			},
			update: function update() {
				watchers.list.page.count();
				watchers.list.page.set(watchers.list.page.current || 1);
				return true;
			},
			set: function set(num) {
				var modifier = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

				num = num + modifier;
				// validate pageNum
				if (typeof num !== 'number' || num < 1) num = 1;else if (num > watchers.list.page.total) num = watchers.list.page.count();
				watchers.list.page.current = Math.floor(num);

				watchers.list.page.items = pg.models.watchers.page(watchers.list.page.current, watchers.list.page.limit);
				return true;
			}
		},

		initialize: function initialize() {
			var mode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'insert';

			watchers.list.page.set(1);
			watchers.list.show();
			return true;
		},

		show: function show() {
			watchers.list.page.update();
			watchers.location = 'watchers/list';
			return true;
		},

		show_deleteWatchersDialog: function show_deleteWatchersDialog(id) {
			watchers.list.target = pg.models.watchers.get(id);
			watchers.location = 'watchers/list_delete';
		},

		delete_watchers: function delete_watchers(id) {
			pg.models.watchers.delete(id);
			watchers.list.initialize();
		}
	},

	model: {},

	form: {
		active: 'watcherDeclarationForm',
		mode: 'insert', // | update
		error: false,
		title: {
			insert: 'New Watcher :',
			update: 'Edit Watcher :'
		},

		UI: {
			watcherDeclarationForm: null
		},

		Data: {},

		initialize: function initialize() {
			var id = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

			if (id !== null) {
				// EDIT MODE DETECTED! ... get watchers Data
				var watcher = pg.models.watchers.get(id);
				if (watcher === -1) throw new Error('watchers.form.initialize(): Can\'t find Watcher with ID : ' + id);
				watchers.form.mode = 'update';
				watchers.form.Data = watcher;
			} else {
				// INSERT MODE DETECTED ... generate new watcher
				watchers.form.mode = 'insert';
				watchers.form.Data = pg.models.watchers.new();
			}

			watchers.form.error = false;
			watchers.location = 'watchers/form';
			watchers.form.show_watcherDeclarationForm();
			return true;
		},

		show_watcherDeclarationForm: function show_watcherDeclarationForm() {
			watchers.form.active = 'watcherDeclarationForm';
		},

		validate_watchersDeclarationForm: function validate_watchersDeclarationForm() {
			pg.log('watchers.form.validate_watchersDeclarationForm(): Validating Watcher Declaration...');
			// reset previous form validations
			watchers.form.error = false;
			// validate form
			if (!watchers.form.UI.watcherDeclarationForm.checkValidity()) {
				pg.log('watchers.form.validate_watchersDeclarationForm(): Form validation failed...');
				watchers.form.error = 'Some fields require your attention.';
				return false;
			}
			// show loader
			pg.loader(watchers.form.UI.watcherDeclarationForm).show();
			// save watchers Data
			pg.models.watchers.save({
				id: watchers.form.Data.id,
				name: watchers.form.Data.name,
				categories: watchers.form.Data.categories,
				directives: [{
					in: 'title',
					has: watchers.form.Data.directives
				}]
			}).then(function (r) {
				//  hide loader
				pg.loader(watchers.form.UI.watcherDeclarationForm).hide();
				// DONE! display ending message!
				watchers.location = 'watchers/form_completed';
			});
			return true;
		},

		validate_feedAssignationsForm: function validate_feedAssignationsForm() {
			/*
   pg.log( 'feeds.form.validate_feedAssignationsForm(): Validating Feed Assignations...' );
   // reset previous form validations
   feeds.form.error = false;
   // validate form
   if( !feeds.form.UI.feedAssignationsForm.checkValidity() ){
   	pg.log( 'feeds.form.validate_feedAssignationsForm(): Form validation failed...' );
   	feeds.form.error = 'Some fields require your attention.';
   	return false;
   }
   loader
   	// save feed Data
   app.saveFeed({
   	id: feeds.form.Data.id,
   	name: feeds.form.Data.name,
   	url : feeds.form.Data.url,
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
   });
   // DONE! display ending message!
   feeds.location = 'feeds/form_completed';
   return true;
   */
		}
	}
};

exports.default = watchers;
//# sourceMappingURL=watchers.js.map
