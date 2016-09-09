"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
//
// usage example :
// element("#myElement").parent()
//
var DOM = {
    get: function get(selector) {
        return selector === undefined ? undefined : document.querySelectorAll(selector);
    }
};

exports.default = DOM.get;
//# sourceMappingURL=get.js.map
