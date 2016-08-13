/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global System , rivets , sightglass */

// Declare importedModels container
rivets.importedModels          = {};
// Set default configuration directives
Object.defineProperty( rivets.importedModels , '__basePath__', {  value: '',  enumerable: false,  writable:true,  configurable: false });
Object.defineProperty( rivets.importedModels , '__constructor__', {  value: false,  enumerable: false,  writable:true,  configurable: false });
Object.defineProperty( rivets.importedModels , '__debug__', {  value: false,  enumerable: false,  writable:true,  configurable: false });


/**
 * [configure_importer description]
 * @param  {[type]} configObj [description]
 * @param  {[type]} w         [description]
 * @param  {[type]} d         [description]
 * @return {[type]}           [description]
 */
rivets.configure_importer   = function(configObj, w, d){
    // allow activity in foreign window and document, if requested...
    var _window = ( typeof w === 'object' &&  w.hasOwnProperty('document') ) ? w : window;
    var _document = ( typeof d === 'object' &&  d.nodeName === '#document') ? d : document;
    // iterate provided config object
    for(var directive in ( configObj || {} ) ){
        if( !configObj.hasOwnProperty(directive) ) continue;
        // if config directive does not exist, create it
        if( !_window.rivets.importedModels.hasOwnProperty('__' + directive + '__') ){
            Object.defineProperty( _window.rivets.importedModels , '__' + directive + '__', { value: '', enumerable: false, writable:true, configurable: false });
        }
        // assign value to config directive
        _window.rivets.importedModels['__' + directive + '__'] = configObj[directive];
        // special behaviour for debug...
        if(directive === 'debug'){
            if( configObj.debug === false ) _document.getElementsById('__rivets_import_debug_styles__').remove();
            else{
                // enable debuging...
                var stylesEl        = _document.createElement('STYLE');
                stylesEl.id         = '__rivets_import_debug_styles__';
                stylesEl.innerHTML = '                                                      \
                    [rv\\:model]{                                                 \
                        border:2px dotted grey;                                             \
                        position:relative;                                                  \
                    }                                                                       \
                    [rv\\:model]::after{                                          \
                        display:block;                                                      \
                        position:absolute;                                                  \
                        top:0;right:0;                                                      \
                        background-color:#000;                                              \
                        content:"\\21b5" " " attr(rv\\:model\\:\\:scopes);                  \
                        padding:3px;                                                        \
                        font-family:arial;                                                  \
                        font-size:10px;                                                     \
                        color:#fff;                                                         \
                    }                                                                       \
                    body[rv\\:debug\\:\\:interactive] [rv\\:model]:hover{         \
                        border:1px dotted grey;                                             \
                        padding:10px;                                                       \
                        margin:5px;                                                         \
                        transition:all .2s ease-out;                                        \
                        position:relative;                                                  \
                    }                                                                       \
                    body[rv\\:debug\\:\\:interactive] [rv\\:model]:hover::after{  \
                        display:block;                                                      \
                        position:absolute;                                                  \
                        top:0;right:0;                                                      \
                        background-color:#000;                                              \
                        content:"\\21b5" " " attr(rv\\:model\\:\\:scopes);                  \
                        padding:3px;                                                        \
                        font-size:10px;                                                     \
                        font-family:arial;                                                  \
                        color:#fff;                                                         \
                    }                                                                       \
                ';
                _document.getElementsByTagName('HEAD')[0].appendChild(stylesEl);
            }
        }
    }
    return true;
};

rivets._.Util.resolveKeyPath = function(keypath, binding,  returnValue, generatePathIfNotExist){
    returnValue = ( returnValue === false ) ? false : true;
    generatePathIfNotExist = ( generatePathIfNotExist === true ) ? true : false;
    // break string keypath into each object level name
    var keypathArray = keypath.split(rivets.rootInterface);
    // must exist at least the model name and a property
    if(keypathArray.length < 2 ) throw new Error('rivets._.Util.resolveKeyPath(): Invalid keypath :' + keypath + '(Needs at least two levels model.property)');
    // resolve the reference to modelRoot
    var modelRoot =  binding.view.models[keypathArray[0]];
    if( modelRoot === undefined ) throw new Error('rivets._.Util.resolveKeyPath() : Model found in Keypath is not binded to Element View.');
    // remove model string from keypath array
    keypathArray.shift();
    // extract the name of the requewted property
    var key =  keypathArray.pop();
    // iterate keypathArray to obtain a Object reference to property parent
    var model = ( keypathArray.length === 1) ? keypathArray[0] : keypathArray.reduce( function(o,i){
        if(generatePathIfNotExist && o[i] === undefined) o[i] = {};
        return  o[i];
    }, modelRoot );
    return returnValue ? rivets.adapters[rivets.rootInterface].get(model,key) : {
        model : model,
        key : key
        //value : rivets.adapters[rivets.rootInterface].get(model,key)
    };
};



/* Assignation */
rivets.formatters.set = function(oldValue,newValue) {
    return function(event, obj, binding){
        //window.binding = binding;
        // var model = obj;
        var kp = rivets._.Util.resolveKeyPath(binding.keypath, binding, false);
        //console.log("newValue: "+newValue);
        // set the value
        var adapter = rivets.adapters[rivets.rootInterface];
        adapter.set(kp.model, kp.key, newValue);
        return true;
    };
};
rivets.formatters['='] = rivets.formatters.set;


rivets.binders['element'] = {
    block:false,
    priority:5000,
    publishes: true,

    bind: function(el){
        console.log( '%c rv-element ' + el.getAttribute('rv-element') + ' : BIND' , 'color: green' );
        this.publish();
        return el;
    },
    routine: function(el,value){
        console.log( '%c rv-element ' + el.getAttribute('rv-element') + ' : ROUTINE' , 'color: orange' );
        return el;
    },
    unbind: function(el){
        console.log( '%c rv-element ' + el.getAttribute('rv-element') + ' : UNBIND' , 'color: red' );
    },
    getValue : function(el) {
        console.log( '%c rv-element ' + el.getAttribute('rv-element') + ' : GET-VALUE' , 'color: yellow' );
        return el;
    }
};





rivets.binders['view'] = {
    block: true,
    priority: 5000,
    bind: function(el) {
        //if( el.firstChild && el.firstChild.hasOwnProperty('getAttribute') && el.firstChild.getAttribute('rv:view') !== null ){
        if( this.nested ){
            console.log( '%c rv-view ' + this.nested.viewName + ' : NESTED UNBIND' , 'color: darkred' );
            el.innerHTML = this.view.initialHTML;
            this.unbind();
        }else{
            console.log( '%c rv-view ' + el.getAttribute('rv-view') + ' : BIND' , 'color: green' );
            this.view.initialHTML = el.innerHTML;
        }

        el.innerHTML = '<div>' + this.view.initialHTML + '</div>';
        return el;
    },
    routine : function(el,viewName){
        var self = this;
        if(!viewName) return false;
        viewName = String( viewName ).trim();

        // if is detected a previous import binding on element...
        if( self.nested ){
            if(viewName === self.nested.viewName ) return false; // ignore if VIEW is the same actually binded
            else{
                console.log( '%c rv-view ' + self.nested.viewName + ' : NESTED UNBIND' , 'color: darkred' );
                self.nested.unbind();
                self.nested= null;
                delete self.nested;
            }
        }
        console.log( '%c rv-view ' + viewName + ' : ROUTINE' , 'color: orange' );

        el.firstChild.setAttribute( 'rv:view' , viewName );
        el.setAttribute('rv-loading', 'true');
        var path = 'html/views/'+ viewName + '.html';
        var done = false;
        var _html = new XMLHttpRequest();
        _html.overrideMimeType('text/html');
        _html.open('GET', path , true);
        _html.onload = _html.onreadystatechange = function () {
            if ( !done && (!this.readyState || this.readyState === 4) ) {
                done = true;
                el.removeAttribute('rv-loading');
                // free memory, explicit  listener removal;
                el.firstChild.innerHTML = _html.responseText;
                console.log( '%c rv-view ' + viewName + ' :  NESTED BIND' , 'color: lightgreen' );

                self.nested = rivets.bind(el.firstChild, self.view.models);
                self.nested.viewName = viewName;

                // if callback  was setted, execute it!
                if(el.getAttribute('rv-on-ready')){
                    rivets._.Util.resolveKeyPath( el.getAttribute('rv-on-ready'), self )(currentView);
                }
                _html.onload = _html.onreadystatechange = null;
            }
        };
        _html.send(null);
    },
    unbind: function(el) {
        console.log( '%c rv-view ' + el.getAttribute('rv-view') + ' : UNBIND' , 'color: red' );
        this.nested.unbind();
        this.nested =  null;
        delete this.nested;
        //this.unbind();
        //var modelName = this.el.removeAttribute('rv-controller:bind');
    },
    update: function(el) {
        console.log( '%c rv-view ' + el.getAttribute('rv-view') + ' : UPDATE' , 'color: yellow' );
        //this.unbind();
        //var modelName = this.el.removeAttribute('rv-controller:bind');
    },
};

/**
 * [model description]
 * @type {[type]}
 */
rivets.binders['model'] = {
    block: true,
    priority: 4000,
    bind: function(el) {
        //if( el.firstChild && el.firstChild.hasOwnProperty('getAttribute') && el.firstChild.getAttribute('rv:model') !== null ){
        if( this.nested ){
            console.log( '%c rv-model ' + self.nested.modelName + ' : NESTED UNBIND' , 'color: darkred' );
            el.innerHTML = this.view.initialHTML;
            this.unbind();
            //throw new Error('Element has already been binded to another import. Unbind first.');
        }else{
            this.view.initialHTML = el.innerHTML;
            console.log( '%c rv-model ' + el.getAttribute('rv-model') + ' : BIND' , 'color: green' );
        }

        el.innerHTML = '<div>' + this.view.initialHTML + '</div>';
        return el;
    },

    routine: function(el,modelName){
        modelName = String( modelName ).trim();
        var self = this;
        // if is detected a previous import binding on element...
        if( el.firstChild.getAttribute( 'rv:model' ) !== null ){
            var currentModel = el.firstChild.getAttribute( 'rv:model' );
            //var viewId = el.firstChild.getAttribute( 'rv:model::id' );
            // ignore if MODEL is the same actually binded
            if(modelName === currentModel ) return false;
            else{
                // if diferent ...unbind previous import binding and destroy view
                console.log( '%c rv-model ' + self.nested.modelName + ' : NESTED UNBIND' , 'color: darkred' );
                self.nested.unbind();
                self.nested = null;
                delete self.nested;
                //el.firstChild.innerHTML = this.view.initialHTML;
            }
        }
        console.log( '%c rv-model ' + modelName + ' : ROUTINE' , 'color: orange' );

        el.firstChild.setAttribute( 'rv:model' , modelName );
        el.firstChild.setAttribute( 'rv:model::scopes' , modelName);

        // import CONTROLLER module if setted &  controller NOT already loaded
        if(modelName.length && !rivets.importedModels.hasOwnProperty(modelName) ){
            el.setAttribute('rv-loading', 'true');
            System.import( rivets.importedModels.__basePath__ + modelName + '.js' ).then(function(controller){
                // create CONTROLLER module instance
                controller = rivets.importedModels[modelName] = controller.default;
                // assign non enumerable meta property NAME
                Object.defineProperty(controller, '__name__', {  value: modelName, enumerable: false, writable:false,  configurable: false });

                var initialize = false;
                if( rivets.importedModels.__constructor__ !== undefined &&
                    typeof rivets.importedModels[modelName][rivets.importedModels.__constructor__] === 'function' &&
                    rivets.importedModels[modelName].__initialized__ !== true ) initialize = true;

                el.removeAttribute('rv-loading');
                _bind(el, modelName, initialize);
            });
        }else _bind( el, modelName , false);

        // INTERNAL WRAPPER BINDER
        function _bind(el, modelName, initializeModel){

            function parents(element, _array) {
                if(element.parentNode===null) window.a = element;
                if(_array === undefined) _array = []; // initial call
                else _array.push(element); // add current element
                // do recursion until HTML is reached
                return (element.tagName !== 'BODY' ) ? parents(element.parentNode, _array) : _array;
            }

            // prepare binding model object
            var bindedObj = {};
            bindedObj[modelName] = rivets.importedModels[modelName];

            // include parent elements, binding models to element
            var _p = parents(el);
            var scopesList = modelName;
            for(var i =0; i<_p.length;i++){
                var parentModel_name = _p[i].getAttribute('rv:model');
                if(parentModel_name !== null){
                    bindedObj[parentModel_name] = rivets.importedModels[parentModel_name];
                    scopesList += ' ' + parentModel_name;
                }
            }
            el.firstChild.setAttribute( 'rv:model::scopes' , scopesList );

            console.log( '%c rv-model ' + modelName + ' : NESTED BIND' , 'color: lightgreen' );

            // do the bindings!
            self.nested =  rivets.bind( el.firstChild, bindedObj );
            self.nested.modelName = modelName;
            console.log(self.nested);

            // if has custom constructor/igniter should be executed...
            if(initializeModel){
                rivets.importedModels[modelName][rivets.importedModels.__constructor__]();
                Object.defineProperty(rivets.importedModels[modelName], '__initialized__', {  value: true, enumerable: false, writable:false,  configurable: false });
            }

            if(el.getAttribute('rv-on-ready')){
                rivets._.Util.resolveKeyPath( el.getAttribute('rv-on-ready'), {view:self.nested} )(currentModel);
            }
            return true;
        }

        return void 0;
    },

    unbind: function(el) {
        console.log( '%c rv-model ' + el.getAttribute('rv-model') + ' : UNBIND' , 'color: red' );
        this.nested.unbind();
        this.nested = null;
        delete this.nested;
        //this.unbind();
        //var modelName = this.el.removeAttribute('rv-controller:bind');
    },

    update: function(models) {
        console.log('***** rv-controller UPDATE ***** ');
        //var _ref1;
        //return (_ref1 = this.nested) !== null ? _ref1.update(models) : void 0;
    }
};


