(function(){
	'use strict';

	document.addEventListener('DOMContentLoaded', function() {
		console.log('Popup opened!');
		var popup = {
			// main buttons
			addFeed 				: querySelector('#add_feed'),
			updateAllFeed 			: querySelector('#update_all_feed'),
			// form
			newFeedForm				: querySelector('#new_feed_form'),
			newFeedForm_name		: querySelector('#new_feed_form [name]'),
			newFeedForm_url			: querySelector('#new_feed_form [url]'),
			newFeedForm_ttl			: querySelector('#new_feed_form [ttl]'),
			newFeedForm_ttl_preview	: querySelector('#new_feed_form .new_feed_form__ttl_preview'),
			newFeedForm_property	: querySelector('#new_feed_form [property]'),
			newFeedForm_property_	: querySelector('#new_feed_form [property]'),
		};


		var form = {

		};
		document.querySelector('#new_feed_form .new_feed_form__range').innerHTML = 12;

		document.getElementById('add_feed').addEventListener("click",function(){

		});
	});



})();
