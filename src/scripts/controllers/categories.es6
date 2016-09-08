/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , pg , rivets , sightglass */


let app;

let categories = {
	__constructor(){
		return new Promise(function(resolve){
			pg.load.controller('app').then( m =>{
				app = m;
				resolve();
			});
		});
	},

	location : 'categories/list',

	initialize : function(){ categories.list.initialize(); },

	list : {
		target : null,

		initialize :  function(mode = 'insert'){
			categories.location = 'categories/list';
		},

		show_deleteCategoryDialog: function(id){
			categories.list.target = app.getCategoryById(id);
			categories.location = 'categories/list_delete';
		},

		delete_category: function(id){
			app.deleteCategory(id);
			categories.list.initialize();
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
				let category = app.getCategoryById(id);
				if( category === -1) throw new Error('categories.form.initialize(): Can\'t find Category with ID : '+ id);
				categories.form.mode = 'update';
				categories.form.Data = category;
			}else{
				// INSERT MODE DETECTED ... generate new Category
				categories.form.mode 		= 'insert';
				categories.form.Data 		= app.emptyCategory();
				categories.form.Data.id 	= pg.guid();
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

			categories.form.Data.name = categories.form.Data.name.trim().toLowerCase();

			if( !categories.form.UI.categoryDeclarationForm.checkValidity() ){
				pg.log( 'categories.form.validate_categoryDeclarationForm(): Form validation failed...' );
				categories.form.error = 'Some fields require your attention.';
				return false;
			}
			// show loader
			pg.loader(categories.form.UI.categoryDeclarationForm).show('Validating Category Source...');
			//
			// validation : duplicated name
			//
			if( app.getCategoryByName(categories.form.Data.name) !== -1 ){
				// if has same ID as duplicated, means is updating entry.... ignore and continue
				if( app.getCategoryByName(categories.form.Data.name).id !== categories.form.Data.id ){
					pg.log( 'categories.form.validate_categoryDeclarationForm(): Name validation failed...' );
					categories.form.error = 'Category name already exist.';
					categories.form.UI.categoryName.setCustomValidity('Category name already exist.');
					pg.loader(categories.form.UI.categoryDeclarationForm).hide();
					return false;
				}
			}
			// not duplicated! save...
			app.saveCategory({
				id: categories.form.Data.id,
				name: categories.form.Data.name,
				count : 0
			});
			//  hide loader
			pg.loader(categories.form.UI.categoryDeclarationForm).hide();
			// DONE! display ending message!
			categories.location = 'categories/form_completed';
			return true;
		},
	}
};

export default categories;

