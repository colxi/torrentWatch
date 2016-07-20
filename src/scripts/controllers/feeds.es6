
const pi = 3.14159265359;
export var calcCircumference = (radius) => {
    return 2 * radius * pi;
};

/*
 export class q {
    constructor() {
      console.log('this is an es6 class!');
    }
  }
*/

/*
class feeds{
	constructor(){
		this.currentView  = 'listing';
		this.helpers = {
			feedProperties 	: [],
			mode 			: 'new'
		};
		this.form = {
			name: '',
			url : 'https://kat.cr/movies/?rss=1',
			categories : [],
			TTL : 60,
			properties :  [],
		};

	}

	static showListing(){

	}

	static showFormData(){
		//
		this.currentView = 'form:data';
	}

	static showFormConfig(){
		console.log('Validating RSS feed...');

		pg.getFeed(this.form.url).then(function(result){
			console.log(result);

			this.helpers.feedProperties = [];
			this.form.properties = [];
			if(result === false){
				alert('RSS invalid');
				return false;
			}

			this.currentView= 'form:config';
			for(let i in result.rss.channel.item[0]){
			 	if( result.rss.channel.item[0].hasOwnProperty(i) &&  i.charAt(0).match(/[A-Z|a-z]/i) ) this.helpers.feedProperties.push(i);
			}
		});
	}

	static saveForm(){
		var feed = {
			id 			: '',
			name 		: '',
			url 		: '',
			properies	: [],
			TTL 		: 0,
			categories 	: [],
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

let _feeds = new feeds();
export default _feeds;
*/
