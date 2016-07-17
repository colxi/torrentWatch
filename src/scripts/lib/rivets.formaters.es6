if(typeof rivets === 'undefined') throw new Error('rivets.formaters.js : Rivets is not found. Formaters can\'t be setted!');


rivets.formatters.call = function (value, arg1 , arg2, arg3 , arg4) {
    return value(arg1 , arg2 , arg3 , arg4);
};

rivets.formatters.set = function (value, variable) {
    return variable = value;
};

// *** Data type

rivets.formatters.number = function (value) {
    return +value;
};

rivets.formatters.string = function (value) {
    return String(value);
};

rivets.formatters.trim = function (value) {
    return (typeof value === "undefined") ? '' : String(value).trim();
};

// *** Boolean negation

rivets.formatters.negate = function (value) {
    return !value;
};
// eg: data-class-disabled="model.valid | negate"

// *** inArray

rivets.formatters.inArray = function (value, array) {
	if( Object.prototype.toString.call(array) !== '[object Array]') return false;
    return (array.indexOf(value) === -1)  ?  false : true;
};
// eg: data-class-disable="model.foo | inArray namespace.myArray"


// *** Equals

rivets.formatters.eq = function (value, args) {
    return value === args;
};
// eg: data-class-disable="model.foo | number | eq 4"

//Not equal

rivets.formatters.not_eq = function (value, args) {
    return value !== args;
};
// eg: data-class-disable="model.foo | not_eq 4"

// *** Greater than

rivets.formatters.gt = function(value, arg) {
    return value > arg;
};
// eg: data-class-disable="model.foo | gt 4"


// Lower than

rivets.formatters.lt = function(value, arg) {
    return value < arg;
};
// eg : data-class-disable="model.foo | lt 4"


// *** Blank

rivets.formatters.blank = function (value) {
    return value === null || value === '' || value === undefined;
};
//eg : data-hide="model.foo | blank"


// ***Event handler preventDefault

rivets.formatters.preventDefault = function(value) {
  return function(e) {
    e.preventDefault();
    value.call(this, e);
    return false;
  };
};
// eg : data-on-submit="model:save | preventDefault"
