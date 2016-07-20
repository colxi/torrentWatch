"use strict";

System.register([], function (_export, _context) {
	"use strict";

	var pi, calcCircumference;
	return {
		setters: [],
		execute: function () {
			Object.defineProperty(_export, "__esModule", {
				value: true
			});

			pi = 3.14159265359;

		 _export('calcCircumference', calcCircumference = function calcCircumference(radius) {
				return 2 * radius * pi;
			} );

        var moduleName = _context.id;

		}
	};
});
