var chrome, rivets, view, pg;

(function(){
	'use strict';

	view = {};
	view._init = document.addEventListener('DOMContentLoaded', function() {
		console.log('Popup opened!');
		pg = chrome.extension.getBackgroundPage().pg;

		pg.configure({
			controller : window.view,
		});
		pg.loadController('feeds');

		view.categories = pg.categories;
		view.feeds 		= pg.feeds;
		view.logStore 	= pg.logStore;

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
			if( view.category.form.name.length === 0 || pg.getCategoryByName(view.category.form.name) !== -1 ) view.category.form.validates  = false;
			if(!view.category.form.validates) return false;

			// create category
			view.categories.push({
				id: pg.createGuid(),
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



})();
