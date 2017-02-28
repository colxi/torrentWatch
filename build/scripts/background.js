'use strict';

/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global chrome , System , rivets , sightglass, pg */

(function () {
    var script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = '/scripts/pomegranade.js';
    script.onload = script.onreadystatechange = function () {
        if (!this.readyState || this.readyState === 'loaded' || this.readyState === 'complete') pg.ready(initialize);
    };
    document.getElementsByTagName('head')[0].appendChild(script);

    function initialize() {
        pg.log('*** Starting Torrent Observer v.' + chrome.app.getDetails().version);
        // LISTENERS FOR POPUP OPEN/CLOSE
        var popup = {
            binding: null,
            document: null
        };
        chrome.runtime.onConnect.addListener(function (port) {
            //
            //
            // popup OPEN
            pg.log('pg.chromeExt.popupObserver(): Popup opened!...');
            popup.document = chrome.extension.getViews({ type: 'popup' })[0].document;
            popup.binding = pg.bind(popup.document.querySelector('html'), {});
            //
            //
            // popup CLOSE listener
            var disconect = port.onDisconnect.addListener(function (x) {
                pg.log('pg.chromeExt.popupObserver(): Popup closed!...');
                pg.unbindAll();
                popup.binding = null;
                popup.document = null;
                disconect = null;
            });
        });
        // LAUNCH APPLICATION MAIN CONTROLLER, for initialization
        return new Promise(function (_resolve) {
            pg.load.controller('app').then(function (r) {
                return pg.log('----------------------------------------------------------------------');
            });
        });
    }
})();
//# sourceMappingURL=background.js.map
