var chrome, rivets, view, app;

(function(){
	'use strict';

	view = {};
	view._init = document.addEventListener('DOMContentLoaded', function() {
		console.log('Popup opened!');
		app = chrome.extension.getBackgroundPage().app;
		view.categories = app.categories;
		view.feeds 		= app.feeds;
		view.logStore 	= app.logStore;

		rivets.configure({
			// Attribute prefix in templates
			prefix: 'rv',
			// Preload templates with initial data on bind
			preloadData: true,
			// Root sightglass interface for keypaths
			rootInterface: '.',
			// Template delimiters for text bindings
			templateDelimiters: ['{', '}'],
			// Augment the event handler of the on-* binder
			handler: function(target, ev, binding) {
				return this.call(target, event, binding.view.models,binding);
			}
		});
		rivets.bind( document.querySelector('#app-wrapper') , { view : view } );
	});

	view.toogleArrayItem = function(item, array, event, object){
		let i = array.indexOf(item);
		if(i === -1) array.push(item);
		else array.splice(i, 1);
		console.log(arguments);
	};

	view.currentTab  	= 'tab-feeds';
	view.categories 	= null;
	view.feeds 			= null;
	view.logStore		= null;

	view.category = {
		form : {
			name 		: '',
			validates 	: true,
		},
		add : function(){
			view.category.form.name = view.category.form.name.trim().toLowerCase();
			view.category.form.validates  = true;
			// validate category name
			if( view.category.form.name.length === 0 || app.getCategoryByName(view.category.form.name) !== -1 ) view.category.form.validates  = false;
			if(!view.category.form.validates) return false;

			// create category
			view.categories.push({
				id: app.createGuid(),
				name: view.category.form.name,
				feeds:0
			});

			// reset input
			view.category.form.name 		= '';
			view.category.form.validates = true;
			return true;
		},
		remove: function(e,i){
			view.categories.splice(i.index, 1);
			return true;
		}
	};

	view.feed = {
 		helpers : {
 			formNav : 'form-data',
 			feedProperties: [],
 			mode : 'new'
 		},

		form : {
			name: '',
			url : 'https://kat.cr/movies/?rss=1',
			categories : [],
			TTL : 60,
			properties :  [],
		},

		save : function(){
			var feed = {
				id 			: '',
				name 		: '',
				url 		: '',
				properies	: [],
				TTL 		: 0,
				categories 	: [],
			};

			feed.id = app.createGuid();
			feed.name = view.feed.form.name.trim();
			feed.url = view.feed.form.url.trim();
			feed.categories = view.feed.form.categories;
			feed.TTL = view.feed.form.TTL;
			feed.properties = view.feed.form.properties;

			view.feeds.push(feed);
			app.countFeedsinAllCategories();
			return true;
		},

		showFormFeedData : function(){ view.feed.helpers.formNav = 'form-data' },

		showFormFeedConfig : function(){
			console.log('Validating RSS feed...');

			app.getFeed(view.feed.form.url).then(function(result){
				console.log(result);

				view.feed.helpers.feedProperties = [];
				view.feed.form.properties = [];
				if(result === false){
					alert('RSS invalid');
					return false;
				}

				view.feed.helpers.formNav= 'form-config';
				for(let i in result.rss.channel.item[0]){
				 	if( result.rss.channel.item[0].hasOwnProperty(i) &&  i.charAt(0).match(/[A-Z|a-z]/i) ) view.feed.helpers.feedProperties.push(i);
				}
			});
		}
	};

})();
