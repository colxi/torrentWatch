'use strict';

/**
 * Copyright:   Matthieu Riolo <advise@ocsource.ch> - Customized by colxi.info (added .args .set)
 * Website:     http://www.ocsource.ch/
 * License:     <see file /License>
 * Created:     2014-11-05
 * Repository:  https://github.com/matthieuriolo/rivetsjs-stdlib
 */



(function (root, factory) {
    if(typeof exports === 'object') {
        // CommonJS
        module.exports = factory(require("rivets"), require('moment'));
    }else if(typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['rivets', 'moment'], factory);
    }else {
        // Browser globals
        factory(root.rivets, root.moment);
    }
})(this, function(rivets, moment) {


    rivets.stdlib = {
        defaultPrecision: 2,
        defaultThousandSeparator: '\'',
        defaultDecimalSeparator: '.',

        defaultDateFormat: 'YYYY-MM-DD',
        defaultTimeFormat: 'HH:mm:ss',
        defaultDatetimeFormat: 'YYYY-MM-DD HH:mm:ss',
    };


    rivets._.Util.resolveKeyPath = function(binding){
        // break string keypath into each object level name
        var keypathArray = binding.keypath.split(rivets.rootInterface);
        // must exist at least the model name and a property
        if(keypathArray.length < 2 ) throw new Error('Invalid keypath :' + binding.keypath);
        // resolve the reference to modelRoot
        var modelRoot =  binding.view.models[keypathArray[0]];
        console.log(binding)
        // remove model string from keypath array
        keypathArray.shift();
        // extract the name of the requewted property
        var key =  keypathArray.pop();
        // iterate keypathArray to obtain a Object reference to property parent
        var model = ( keypathArray.length === 1) ? keypathArray[0] : keypathArray.reduce( (o,i)=>o[i], modelRoot );
        console.log("model: ", model);
        console.log("key: " + key);
        return {
            model : model,
            key : key,
            value : rivets.adapters[rivets.rootInterface].get(model,key)
        };
    };


    /* Assignation */

    rivets.formatters.set = function(oldValue,newValue) {
        return function(event, obj, binding){
            //window.binding = binding;
            // var model = obj;
            var kp = rivets._.Util.resolveKeyPath(binding);
            //console.log("newValue: "+newValue);
            // set the value
            var adapter = rivets.adapters[rivets.rootInterface];
            adapter.set(kp.model, kp.key, newValue);
            return true;
        };
    };




    /* Arrays */

    rivets.formatters.findIndexBy = function(_array, _property , _value){
        if( !rivets.formatters.isArray(_array) ) throw new Error('rivets.formatters.findIndexBy(): Can\'t operate on non Array object');
        return _array.findIndex( function(i){ return (i[_property] === _value) ? true : false; }); // -1, not found
    };

    rivets.formatters.findBy = function(_array, _property , _value){
        if( !rivets.formatters.isArray(_array) ) throw new Error('rivets.formatters.findBy(): Can\'t operate on non Array object');
        return  _array.find( function(i){ return (i[_property] === _value) ? true : false; }); // return undefined if not found
    };


    /* Objectts */

    rivets.formatters.getProperty = function(_object, _property){
        return (_object === undefined) ? false :_object[_property];
    };

    /* Each Iterator */

    rivets.formatters.isLastIn = function(iterationItem, iteratedArray){
        // iterationItem stablishes the needed context for this, to get current index
        return +this.index === +iteratedArray.length - 1;
    };


    /* logical opetators */
    rivets.formatters['==='] = function(target, val) { return target === val; };
    rivets.formatters['=='] = function(target, val) { return target == val; };

    rivets.formatters['!=='] = function(target, val) { return target !== val; };
    rivets.formatters['!='] = function(target, val) { return target != val; };

    /* Function */

    rivets.formatters['args'] = function(target) {
        var args = Array.prototype.slice.call(arguments);
        args.splice(0,1);
        return function(evt) {
            var args_cpy = args.slice();
            Array.prototype.push.apply(args_cpy, Array.prototype.slice.call(arguments));
            return target.apply(this, args_cpy);
        };
    };
    // alias
    rivets.formatters['()'] = rivets.formatters['args'];



    rivets.binders.controller = {
        block: true,
        priority: 4000,
        bind: function(el) {
            console.log('***** rv-controller bind ');
            console.log(this);

            //this._ControllerReady = this._ControllerReady || false;
            //console.log('***** rv-controller bind . ready ?', this._ControllerReady);
            //console.log(this);
            //if( !this._ControllerReady ) this.bound = false;

        },

        unbind: function(el) {
            console.log('***** rv-controller unbind ');

        },

        update: function(models) {
            var _ref1;
            return (_ref1 = this.nested) != null ? _ref1.update(models) : void 0;
        },

        routine: function(el , controllerId) {
            if(typeof controllerId === 'object') return false;
            console.log('***** rv-controller routine ');
            console.log(this);


            rivets.Controllers = rivets.Controllers || {};
            var basePath = 'scripts/controllers/';
            var customConstructor = '__constructor';
            var _self = this;
            // if controllerId is not a model property, try to get the attribute value
            if(controllerId === undefined){
                controllerId = el.getAttribute(rivets.prefix+'-controller');
                if(controllerId === undefined || controllerId === '' ) return false;
            }
            controllerId = String( controllerId ).trim();
            var controllerPath = basePath + controllerId + '.js';


            var bindConstructor = function(controller){
                //if( controllerId === 'main') window[pg.config.appReference] = pg.controllers[controllerId];
                //delete pg.controllers[controllerId].length; // babel transpiler autogen ¿?
                //delete pg.controllers[controllerId].__constructor; // ensure one time executable
                var _binding ={};
                _binding[controllerId] = controller;

                //var document  = chrome.extension.getViews({ type: 'popup' })[0].document;
                //document.querySelector('#controller-feeds').innerHTML = '<div>{feeds.currentView}</div>';
               var el2 = el.cloneNode(true);
               el2.removeAttribute('rv-controller');
               el.parentNode.insertBefore( el2 , el );
               el.parentNode.removeChild( el );
               var rv_view =  rivets.bind( el2 ,_binding );
                Object.defineProperty(controller, '__view__', {
                    value: rv_view,
                    enumerable: false,
                    writable:true,
                    configurable: true
                });
                // make App controller accessible to loaded view , appending it
                _binding.app = app;
                rv_view.update(_binding );
            };

            // import CONTROLLER module
            System.import(controllerPath).then(function(controller){
                // create CONTROLLER module instance
                controller = rivets.Controllers[controllerId] = controller.default;
                // check if has custom constructor/igniter
                if( customConstructor !== undefined &&  controller.hasOwnProperty(customConstructor) &&  typeof controller[customConstructor] === 'function' ){
                    // execute CONTROLLER module custom constructor
                    var _c = controller[customConstructor]();
                    // execute constructor (if returns promise resolve promise before binding)
                    if( _c !== undefined && _c.hasOwnProperty('then') &&  typeof _c.then === 'function') _c.then( function(){ bindConstructor(controller) });
                    else bindConstructor(controller);
                }else bindConstructor(controller);
            });
            return;

            /*
            var path = rivets._.Util.resolveKeyPath(this);
            if(path.value === undefined || path.value === false || path.value === '') return false;
            else console.log('rivets.blinder.include.routine() : Proceeding to load ' + String(path.value));
            this.load( String(path.value) );
            */
        }
  };




    rivets.binders.include = {
        bind: function(el) {
            var self = this;

            this.clear = function() {
                if (this.nested)  this.nested.unbind();
                el.innerHTML = '';
            };

            this.load = function(path) {
                //console.log("$$$$$$$$$$$$$$$$$$$$$$$")
                //console.log(path)
                this.clear();
                if (typeof path === 'function') path = path();
                if (!path || path === undefined || path === '')  return false;


                var _html = new XMLHttpRequest();
                var done = false;
                _html.overrideMimeType("text/html");
                _html.open('GET', path , true);
                _html.onload = _html.onreadystatechange = function () {
                    if ( !done && (!this.readyState || this.readyState === 4) ) {
                        // done! execute PROMISE RESOLVE
                        done = true;
                        self.loadComplete( _html );
                        // cleans up a little memory, removing listener;
                        return (_html.onload = _html.onreadystatechange = null);
                    }
                };
                _html.onerror = function( _err ){ self.loadComplete( _html, _err ); };
                _html.send(null);
            };

            this.loadComplete = function(response) {
                //console.log(err, response);
                var body = response.responseText;
                /*

                if (err) {
                    self.clear();
                    if (console) console.error(err);
                    return;
                }
                */
                console.log(el);
                el.innerHTML = body;

                // copy models into new view
                var models = {};
                for(var key in self.view.models) if( models.hasOwnProperty(key) ) models[key] = self.view.models[key];

                var options = {};
                if (typeof self.view['options'] === 'function') options = self.view.options();

                var els = Array.prototype.slice.call(el.childNodes);
                self.nested = rivets.bind(els, models, options);

                // dispatch include event
                /*
                var event = new CustomEvent('include', {
                detail: {
                  path: path
                },
                bubbles: true,
                cancelable: true
                });

                el.dispatchEvent(event);
                */
            };
        },

        unbind: function(el) {

            if (this.clear) this.clear();
        },

        routine: function(el, value) {
            //console.log("--------------")
            //console.log(el, value,this)
            var path = rivets._.Util.resolveKeyPath(this);
            //console.log(path);
            if(path.value === undefined || path.value === false || path.value === '') return false;
            else console.log('rivets.blinder.include.routine() : Proceeding to load ' + String(path.value));
            this.load( String(path.value) );
        }
  };









    /*
     * basic formatters for rivets
     *
     */

    /* general */
    rivets.formatters.log = function(target) {
        return console.log(target);
    };

    rivets.formatters.default = function(target, val) {
        return !rivets.formatters.isEmpty(target) ? target : val;
    };

    rivets.formatters.add = function(target, val) {
        return target + val;
    };

    rivets.formatters.sub = function(target, val) {
        return target - val;
    };

    rivets.formatters.map = function(target, obj, prop) {
        var args = Array.prototype.slice.call(arguments);
        args.splice(1,2);
        return obj[prop].apply(obj, args);
    };



    /* check JS types */

    rivets.formatters.isBoolean = function(target) {
        return typeof target === 'boolean';
    };

    rivets.formatters.isNumeric = function(target) {
        return !isNaN(target);
    };

    rivets.formatters.isNaN = function(target) {
        if(rivets.formatters.isArray(target))
            return true;
        return isNaN(target);
    };


    rivets.formatters.isInteger = function(n) {
        /**
         * thanks a lot to Dagg Nabbit
         * http://stackoverflow.com/questions/3885817/how-to-check-if-a-number-is-float-or-integer
         */
        return n === +n && n === (n|0);
    };

    rivets.formatters.isFloat = function(n) {
        /**
         * thanks a lot to Dagg Nabbit
         * http://stackoverflow.com/questions/3885817/how-to-check-if-a-number-is-float-or-integer
         */
        return Infinity !== n && n === +n && n !== (n|0);
    };

    rivets.formatters.isNumber = function(target) {
        return rivets.formatters.isFloat(target) || rivets.formatters.isInteger(target);
    };

    rivets.formatters.isObject = function(target) {
        return rivets.formatters.toBoolean(target) && typeof target === 'object' && !rivets.formatters.isArray(target);
    };

    rivets.formatters.isFunction = function(target) {
        return typeof target ==='function';
    };

    rivets.formatters.isArray = function(target) {
        return rivets.formatters.isFunction(Array.isArray) ? Array.isArray(target) : target instanceof Array;
    };

    rivets.formatters.isString = function(target) {
        return typeof target === 'string' || target instanceof String;
    };

    rivets.formatters.isInfinity = function(target) {
        return target === Infinity;
    };

    /* convert JS types */

    rivets.formatters.toBoolean = function(target) {
        return !!target;
    };

    rivets.formatters.toInteger = function(target) {
        var ret = parseInt(target * 1, 10);
        return isNaN(ret) ? 0 : ret;
    };

    rivets.formatters.toFloat = function(target) {
        var ret = parseFloat(target * 1.0);
        return isNaN(ret) ? 0.0 : ret;
    };

    rivets.formatters.toDecimal = function(target) {
        var retI = rivets.formatters.toInteger(target*1);
        var retF = rivets.formatters.toFloat(target);
        return retI === retF ? retI : retF;
    };

    rivets.formatters.toArray = function(target) {
        if(rivets.formatters.isArray(target)) {
            return target;
        }else if(rivets.formatters.isObject(target)) {
            return rivets.formatters.values(target);
        }

        return [target];
    };

    rivets.formatters.toString = function(target) {
        return target ? target.toString() : '';
    };

    rivets.formatters.integer = {
        read: function(target) {
            return rivets.formatters.toInteger(target);
        },

        publish: function(target) {
            return rivets.formatters.toInteger(target);
        }
    };

    /* Math functions */
    rivets.formatters.sum = function(target, val) {
        return (1 * target) + (1 * val);
    };

    rivets.formatters.substract = function(target, val) {
        return (1 * target) - (1 * val);
    };

    rivets.formatters.multiply = function(target, val) {
        return (1 * target) * (1 * val);
    };

    /*
    rivets.formaters.crossMultiplication = function(target, base, total) {
        return (target / base) * total
    }
    rivets.formaters.percents = function(target, base, total) {
        return rivets.formaters.crossMultiplication(target, base, total) + "%";
    }
    */

    rivets.formatters.divide = function(target, val) {
        return (1 * target) / (1 * val);
    };

    rivets.formatters.min = function() {
        return Math.min.apply(Math, arguments);
    };

    rivets.formatters.max = function() {
        return Math.max.apply(Math, arguments);
    };

    /* comparisons */

    rivets.formatters.isEqual = function(target, val) {
        return target === val;
    };

    rivets.formatters.isNotEqual = function(target, val) {
        return target !== val;
    };

    rivets.formatters.isLess = function(target, val) {
        return (target * 1) < (val * 1);
    };

    rivets.formatters.isGreater = function(target, val) {
        return (target * 1) > (val * 1);
    };

    rivets.formatters.isLessEqual = function(target, val) {
        return (target * 1) <= (val * 1);
    };

    rivets.formatters.isGreaterEqual = function(target, val) {
        return (target * 1) >= (val * 1);
    };

    /* logical functions */

    rivets.formatters.or = function() {
        for(var i = 0; i < arguments.length; i++) {
            if(rivets.formatters.toBoolean(arguments[i])) {
                return true;
            }
        }
        return false;
    };

    rivets.formatters.and = function() {
        for(var i = 0; i < arguments.length; i++) {
            if(!rivets.formatters.toBoolean(arguments[i])) {
                return false;
            }
        }

        return true;
    };

    rivets.formatters.negate = function(target) {
        return !rivets.formatters.toBoolean(target);
    };

    rivets.formatters.if = function(target, trueCase, falseCase) {
        return rivets.formatters.toBoolean(target) ? trueCase : falseCase;
    };

    /* number functions */
    rivets.formatters.numberFormat = function(target, precision, decimalSeparator, thousandSeparator) {
        target = rivets.formatters.isNumber(target) ? target : rivets.formatters.toDecimal(target);

        if(!rivets.formatters.isInteger(precision))
            precision = rivets.stdlib.defaultPrecision;
        if(!decimalSeparator)
            decimalSeparator = rivets.stdlib.defaultDecimalSeparator;
        if(!thousandSeparator)
            thousandSeparator = rivets.stdlib.defaultThousandSeparator;

        /*
         *thanks to user2823670
         * http://stackoverflow.com/questions/10015027/javascript-tofixed-not-rounding
         */
        var ret = (+(Math.round(+(Math.abs(target) + 'e' + precision)) + 'e' + -precision)).toFixed(precision);
        if(target < 0)
            ret = '-' + ret;

        /**
         * thanks to Elias Zamaria
         * http://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
         */
        ret = ret.split('.');
        if(ret.length===2) {
            return ret[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator) + decimalSeparator + ret[1];
        }

        return ret[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandSeparator);
    };

    /* date functions */

    rivets.formatters.date = function(target) {
        return moment(target).format(rivets.stdlib.defaultDateFormat);
    };

    rivets.formatters.time = function(target) {
        return moment(target).format(rivets.stdlib.defaultTimeFormat);
    };

    rivets.formatters.datetime = function(target) {
        return moment(target).format(rivets.stdlib.defaultDatetimeFormat);
    };

    rivets.formatters.toTimestamp = function(target) {
        return moment(target).format('X');
    };

    rivets.formatters.toDate = function(target) {
        return moment.unix(target).toDate();
    };

    rivets.formatters.toMoment = function(target) {
        return moment(target);
    };

    /**
     * The date formatter returns a formatted date string according to the moment.js
     * formatting syntax.
     *
     * ```html
     * <span rv-value="model:date | date 'dddd, MMMM Do'"></span>
     * ```
     *
     * @see {@link http://momentjs.com/docs/#/displaying} for format options.
     */
    rivets.formatters.dateFormat = function(target, val) {
        return moment(target).format(val);
    };

    /* object functions */

    rivets.formatters.pairs = function(target) {
        return Object.keys(target).map(function(key) {
            return {
                'object': target,
                'property': key,
                'value': target[key]
            };
        });
    };

    rivets.formatters.keys = function(target) {
        return Object.keys(target);
    };

    rivets.formatters.values = function(target) {
        return Object.keys(target).map(function(key) { return target[key]; });
    };

    /* string functions */

    rivets.formatters.stringFormat = function(target) {
        for(var i = 1; i < arguments.length; i++) {
            var offset = target.indexOf('%s');
            if(offset === -1){
                break;
            }

            target = target.slice(0, offset) + arguments[i] + target.slice(offset + 2);
        }

        return target;
    };


    rivets.formatters.split = function(target, val) {
        return target.split(val);
    };

    rivets.formatters.lower = function(target) {
        return target.toLowerCase();
    };

    rivets.formatters.upper = function(target) {
        return target.toUpperCase();
    };

    rivets.formatters.capitalize = function(target) {
        target = rivets.formatters.toString(target);
        return target.split(' ').map(function(seq) {
            return seq.split('-').map(function(word) {
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join('-');
        }).join(' ');
    };

    /* string&array functions */
    rivets.formatters.contains = function(target, val) {
        return target.indexOf(val) !== -1;
    };

    rivets.formatters.doesNotContain = function(target, val) {
        return rivets.formatters.negater(rivets.formatters.contains(target, val)) === -1;
    };

    rivets.formatters.prettyPrint = function(target) {
        return JSON.stringify(target, null, 2);
    };

    rivets.formatters.isEmpty = function(target) {
        if(!rivets.formatters.toBoolean(target))
            return true;
        return rivets.formatters.toArray(target).length === 0;
    };

    /* array formatters */

    rivets.formatters.length = function(target) {
        if(rivets.formatters.isString(target))
            return target.length;
        return rivets.formatters.toArray(target).length;
    };

    rivets.formatters.join = function(target, val) {
        return rivets.formatters.toArray(target).join(val);
    };

    /* functions formatters */

    rivets.formatters.wrap = function(target) {
        var args = Array.prototype.slice.call(arguments);
        args.splice(0,1);

        return function(evt) {
            var cpy = args.slice();
            Array.prototype.push.apply(cpy, Array.prototype.slice.call(arguments));
            return target.apply(this, cpy);
        };
    };


    rivets.formatters.delay = function(target, ts) {
        var self = this;
        return function() {
            setTimeout(function() { target.apply(self, arguments); }, ts);
        };
    };

    rivets.formatters.preventDefault = function(target) {
        var self = this;
        return function(evt) {
            evt.preventDefault();
            target.call(self, evt);
            return false;
        };
    };

    /*
     * basic bindings for rivets
     *
     */

    rivets.binders.width = function(el, value) {
        el.style.width = value;
    };

    rivets.binders.height = function(el, value) {
        el.style.height = value;
    };

    /* extra bind-type for rivets - we may need a better solution than that one */
    rivets.binders.template = {
        block: true,

        bind: function() {

            this.subviews = [];
        },

        unbind: function(el) {

            this.subviews.forEach(function(el) {
                el.unbind();
            });
        },

        routine: function(el, value) {

            var self = this;

            //kill old data
            this.subviews.forEach(function(el) {
                el.unbind();
            });
            this.subviews = [];

            //set new value
            $(el).html(value);

            //make subhtml binding capable
            var options = {
              binders: this.view.binders,
              formatters: this.view.formatters,
              adapters: this.view.adapters,
              config: this.view.config
            };

            var models = {};
            for(var k in self.view.models) {
                models[k] = self.view.models[k];
            }

            $(el).children().each(function() {
                var v = new rivets._.View(this, models);///rivets.bind(this, models)
                v.bind();
                self.subviews.push(v);
            });
        },

        update: function(models) {

            this.subviews.forEach(function(el) {
                el.update(models);
            });
        },
    };


    /* formatter shortcuts */
    rivets.formatters.eq = rivets.formatters.isEqual;
    rivets.formatters.ne = function(target, val) {
        return rivets.formatters.negate(rivets.formatters.isEqual(target, val));
    };

    rivets.formatters.lt = rivets.formatters.isLower;
    rivets.formatters.gt = rivets.formatters.isGreater;

    rivets.formatters.le = rivets.formatters.isLowerEqual;
    rivets.formatters.lte = rivets.formatters.isLowerEqual;

    rivets.formatters.ge = rivets.formatters.isGreaterEqual;
    rivets.formatters.gte = rivets.formatters.isGreaterEqual;

    rivets.formatters.prv = rivets.formatters.preventDefault;
    rivets.formatters.inject = rivets.formatters.stringFormat;
    rivets.formatters.format = rivets.formatters.dateFormat;
    rivets.formatters.len = rivets.formatters.length;
    rivets.formatters.def = rivets.formatters.default;
    rivets.formatters.neg = rivets.formatters.negate;

    rivets.formatters.date = rivets.formatters.dateFormat;

    rivets.formatters.stringify = rivets.formatters.prettyPrint;
    rivets.formatters.int = rivets.formatters.integer;
});
