/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */



let watchers = {
	__constructor(){
		return new Promise(function(resolve){
			pg.load.model('watchers').then( m =>resolve(watchers.model = m) );
		});
	},

	location : 'watchers/list',

	initialize : function(){ watchers.list.initialize(); },

	list : {
		target : null,

		initialize :  function(mode = 'insert'){
			watchers.location = 'watchers/list';
		},

		show_deleteWatchersDialog: function(id){
			watchers.list.target = watchers.model.get(id);
			watchers.location = 'watchers/list_delete';
		},

		delete_watchers: function(id){
			watchers.model.delete(id);
			watchers.list.initialize();
		}
	},

	model: {},

	form : {
		active 				: 'watcherDeclarationForm',
		mode 				: 'insert', // | update
		error 				: false,
		title: {
			insert 			: 'New Watcher :',
			update 			: 'Edit Watcher :'
		},

		UI : {
			watcherDeclarationForm 	: null
		},

		Data : {},


		initialize :  function(id = null){
			if( id !== null ){
				// EDIT MODE DETECTED! ... get Feed Data
				let watcher = watchers.model.get(id);
				if( watcher === -1) throw new Error('watchers.form.initialize(): Can\'t find Watcher with ID : '+ id);
				watchers.form.mode = 'update';
				watchers.form.Data = watcher;
			}else{
				// INSERT MODE DETECTED ... generate new Feed
				watchers.form.mode 		= 'insert';
				watchers.form.Data 		= watchers.model.new();
				watchers.form.Data.id 	= pg.guid();
			}

			watchers.form.error 	= false;
			watchers.location 		= 'watchers/form';
			watchers.form.show_watcherDeclarationForm();
			return true;
		},

		show_watcherDeclarationForm: function(){ watchers.form.active = 'watcherDeclarationForm'; },

		validate_watchersDeclarationForm: function(){
			pg.log( 'watchers.form.validate_watchersDeclarationForm(): Validating Watcher Declaration...' );
			// save feed Data
			watchers.model.save({
				id: watchers.form.Data.id,
				name: watchers.form.Data.name,
				categories 	: watchers.form.Data.categories,
				directives 	: [
					{
						in : 'title',
						has : watchers.form.Data.directives
					}
				],
			});
			// DONE! display ending message!
			watchers.location = 'watchers/list';
			return true;
		},

		validate_feedAssignationsForm: function(){
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

export default watchers;
