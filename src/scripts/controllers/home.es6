/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */


let categories = {
	__constructor(){
		return new Promise(function(resolve){
			pg.load.model('categories').then( r => resolve() );
		});
	},

	location : 'categories/list',

	initialize : function(){ categories.list.initialize(); },

	list : {
		target : null,

		page:{
			current 	: 1,	// current page
			total 		: 1,	// total pages
			limit 		: 5,	// limit of items
			order 		: 'DESC',
			sortBy 		: 'id',
	 		items 		: [],
			count(){ return( categories.list.page.total = Math.ceil(pg.models.categories.page(0).length / categories.list.page.limit) )},
			update(){
				categories.list.page.count();
				categories.list.page.set(categories.list.page.current || 1);
				return true;
			},
			set(num, modifier=0){
				num = num + modifier;
				// validate pageNum
				if(typeof num !== 'number' || num < 1) num = 1;
				else if(num > categories.list.page.total) num = categories.list.page.count();
				categories.list.page.current = Math.floor(num);

				categories.list.page.items = pg.models.categories.page(categories.list.page.current, categories.list.page.limit);
				return true;
			}
		},

		initialize :  function(mode = 'insert'){
			categories.list.page.set(1);
			categories.list.show();
			return true;
		},

		show : function(){
			categories.list.page.update();
			categories.location = 'categories/list';
			return true;
		},

		show_deleteCategoryDialog: function(id){
			categories.list.target = pg.models.categories.get(id);
			categories.location = 'categories/list_delete';
		},

		delete_category: function(id){
			pg.models.categories.delete(id);
			categories.list.show();
		}
	},

	form : {
		active 				: 'categoryDeclarationForm',
		mode 				: 'insert', // | update
		error 				: false,
		title: {
			insert 			: 'New Category :',
			update 			: 'Edit Category :'
		},

		UI : {
			categoryDeclarationForm : null,
			categoryName 			: null
		},

		Data : {},


		initialize :  function(id = null){
			if( id !== null ){
				// EDIT MODE DETECTED! ... get Category Data
				let category = pg.models.categories.get(id);
				if( category === -1) throw new Error('categories.form.initialize(): Can\'t find Category with ID : '+ id);
				categories.form.mode = 'update';
				categories.form.Data = category;
			}else{
				// INSERT MODE DETECTED ... generate new Category
				categories.form.mode 		= 'insert';
				categories.form.Data 		= pg.models.categories.new();
			}

			categories.form.error 	= false;
			categories.location 	= 'categories/form';
			categories.form.show_categoryDeclarationForm();
			return true;
		},

		show_categoryDeclarationForm: function(){ categories.form.active = 'categoryDeclarationForm'; },

		validate_categoryDeclarationForm: function(){
			pg.log( 'categories.form.validate_categoryDeclarationForm(): Validating Category Declaration...' );
			// reset previous form validations
			categories.form.error = false;
			categories.form.UI.categoryName.setCustomValidity('');
			// validate form

			categories.form.Data.name = (categories.form.Data.name || '').trim().toLowerCase();

			if( !categories.form.UI.categoryDeclarationForm.checkValidity() ){
				pg.log( 'categories.form.validate_categoryDeclarationForm(): Form validation failed...' );
				categories.form.error = 'Some fields require your attention.';
				return false;
			}
			// show loader
			pg.loader(categories.form.UI.categoryDeclarationForm).show();
			//
			// validation : duplicated name
			//
			if( pg.models.categories.getByName(categories.form.Data.name) !== -1 ){
				// if has same ID as duplicated, means is updating entry.... ignore and continue
				if( pg.models.categories.getByName(categories.form.Data.name).id !== categories.form.Data.id ){
					pg.log( 'categories.form.validate_categoryDeclarationForm(): Name validation failed...' );
					categories.form.error = 'Category name already exist.';
					categories.form.UI.categoryName.setCustomValidity('Category name already exist.');
					pg.loader(categories.form.UI.categoryDeclarationForm).hide();
					return false;
				}
			}
			// not duplicated! save...
			pg.models.categories.save({
				id: categories.form.Data.id,
				name: categories.form.Data.name,
				count : 0
			}).then( r=> {
				//  hide loader
				pg.loader(categories.form.UI.categoryDeclarationForm).hide();
				// DONE! display ending message!
				categories.location = 'categories/form_completed';
			});
			return true;
		}
	}
};

export default categories;

