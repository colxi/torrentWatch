class categories{
	__constructor(){
		this.currentView  = 'listing';
		this.helpers = {
			mode 			: 'new'
		};
		this.form = {
			name 		: '',
			validates 	: true,
		};

	}

	static showListing(){
		this.currentView  = 'listing';
	}

	static showForm(){
		this.currentView  = 'form';
	}

	static delete (e,i){
			view.categories.splice(i.index, 1);
			return true;
		}

	static saveForm(){
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
	}
}

export default categories;
