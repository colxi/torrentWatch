'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var http = function http(url) {

  // A small example of object
  var core = {

    // Method that performs the ajax request
    ajax: function ajax(method, url, args) {

      // Creating a promise
      var promise = new Promise(function (resolve, reject) {

        // Instantiates the XMLHttpRequest
        var client = new XMLHttpRequest();
        var uri = url;

        if (args && (method === 'POST' || method === 'PUT')) {
          uri += '?';
          var argcount = 0;
          for (var key in args) {
            if (args.hasOwnProperty(key)) {
              if (argcount++) {
                uri += '&';
              }
              uri += encodeURIComponent(key) + '=' + encodeURIComponent(args[key]);
            }
          }
        }

        client.open(method, uri);
        client.send();

        client.onload = function () {
          if (this.status >= 200 && this.status < 300) {
            // Performs the function "resolve" when this.status is equal to 2xx
            resolve(this.response);
          } else {
            // Performs the function "reject" when this.status is different than 2xx
            reject(this.statusText);
          }
        };
        client.onerror = function () {
          reject(this.statusText);
        };
      });

      // Return the promise
      return promise;
    }
  };

  // Adapter pattern
  return {
    'get': function get(args) {
      return core.ajax('GET', url, args);
    },
    'post': function post(args) {
      return core.ajax('POST', url, args);
    },
    'put': function put(args) {
      return core.ajax('PUT', url, args);
    },
    'delete': function _delete(args) {
      return core.ajax('DELETE', url, args);
    }
  };
};

exports.default = http;
//# sourceMappingURL=http.js.map
