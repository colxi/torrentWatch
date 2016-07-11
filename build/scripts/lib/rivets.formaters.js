'use strict';

var rivets = rivets || null;

// *** Data type

rivets.formatters.number = function (value) {
    return +value;
};

rivets.formatters.string = function (value) {
    return String(value);
};

// *** Boolean negation

rivets.formatters.negate = function (value) {
    return !value;
};
// eg: data-class-disabled="model.valid | negate"

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

rivets.formatters.gt = function (value, arg) {
    return value > arg;
};
// eg: data-class-disable="model.foo | gt 4"

// Lower than

rivets.formatters.lt = function (value, arg) {
    return value < arg;
};
// eg : data-class-disable="model.foo | lt 4"

// *** Blank

rivets.formatters.blank = function (value) {
    return value === null || value === '' || value === undefined;
};
//eg : data-hide="model.foo | blank"

// ***Event handler preventDefault

rivets.formatters.preventDefault = function (value) {
    return function (e) {
        e.preventDefault();
        value.call(this, e);
        return false;
    };
};
// eg : data-on-submit="model:save | preventDefault"
//# sourceMappingURL=rivets.formaters.js.map
