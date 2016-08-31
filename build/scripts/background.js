'use strict';

/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , rivets , sightglass, pg */

(function () {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '/scripts/pg-core.js';
    script.onload = script.onreadystatechange = function () {
        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') pg.ready(background.initialize);
    };
    document.getElementsByTagName('head')[0].appendChild(script);

    var background = {
        initialize: function initialize() {
            console.log('reaadyy!!');
        }
    };
})();
//# sourceMappingURL=background.js.map
