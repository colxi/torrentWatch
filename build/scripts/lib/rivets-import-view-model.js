/* jsHint inline configuration : */
/* jshint undef: true, unused: false */
/* global System , rivets , sightglass */

// Declare importedModels container
rivets.importedModels          = {};
// Set default configuration directives
Object.defineProperty( rivets.importedModels , '__count__', {  value: 0,  enumerable: false,  writable:true,  configurable: false });
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
            // disable debuging...
            if( configObj[directive] === false ) _document.getElementsById('__rivets_import_debug_styles__').remove();
            // enable debuging...
            else{
                var stylesEl        = _document.createElement('STYLE');
                stylesEl.id         = '__rivets_import_debug_styles__';
                stylesEl.innerHTML = '                                                      \
                    [rv\\:model\\:\\:name]{                                                 \
                        border:2px dotted grey;                                             \
                        position:relative;                                                  \
                    }                                                                       \
                    [rv\\:model\\:\\:name]::after{                                          \
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
                    body[rv\\:debug\\:\\:interactive] [rv\\:model\\:\\:name]:hover{         \
                        border:1px dotted grey;                                             \
                        padding:10px;                                                       \
                        margin:5px;                                                         \
                        transition:all .2s ease-out;                                        \
                        position:relative;                                                  \
                    }                                                                       \
                    body[rv\\:debug\\:\\:interactive] [rv\\:model\\:\\:name]:hover::after{  \
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


rivets.binders['view'] = {
    block: true,
    priority: 5000,
    bind: function(el) {
        console.log('**************************************************');
        console.log('rv-view BIND ',el,this);

        if( !(el.firstChild && el.firstChild.hasOwnProperty('getAttribute') && el.firstChild.getAttribute('rv:view::name') !== null) ){
            // initial inline view backup
            this.view.initialHTML = el.innerHTML;
        }

        el.innerHTML = '<div>' + this.view.initialHTML + '</div>';
        return el;
    },
    routine : function(el,viewName){
        console.log('rv-view ROUTINE',el,viewName,this);
        var self = this;
        if(!viewName) return false;
        viewName = String( viewName ).trim();


        // if is detected a previous import binding on element...
        if( el.firstChild.getAttribute( 'rv:view::name' ) !== null ){
            var currentView = el.firstChild.getAttribute( 'rv:view::name' );
            // ignore if VIEW is the same actually binded
            if(viewName === currentView ) return false;
            else{
                // if diferent ...unbind previous import binding and destroy view
            }
        }
        el.firstChild.setAttribute( 'rv:view::name' , viewName );

        var path = 'html/views/'+ viewName + '.html';
        var done = false;
        var _html = new XMLHttpRequest();
        _html.overrideMimeType('text/html');
        _html.open('GET', path , true);
        _html.onload = _html.onreadystatechange = function () {
            if ( !done && (!this.readyState || this.readyState === 4) ) {
                done = true;
                // free memory, explicit  listener removal;
                el.firstChild.innerHTML = _html.responseText;
                rivets.bind(el.firstChild, self.view.models);
                _html.onload = _html.onreadystatechange = null;
            }
        };
        _html.send(null);
    }
};

/**
 * [model description]
 * @type {[type]}
 */
rivets.binders['model'] = {
    block: true,
    priority: 4000,
    bind: function(el) {
        console.log('**************************************************');
        console.log('rv-model BIND ',el);

        if( el.firstChild && el.firstChild.hasOwnProperty('getAttribute') && el.firstChild.getAttribute('rv:model::name') !== null ){
            throw new Error('Element has already been binded to another import. Unbind first.');
        }else this.view.initialHTML = el.innerHTML;

        el.innerHTML = '<div>' + this.view.initialHTML + '</div>';

        return el;
    },

    routine: function(el,modelName){
        console.log('rv-model ROUTINE',el,modelName,this);
        modelName = String( modelName ).trim();

        // if is detected a previous import binding on element...
        if( el.firstChild.getAttribute( 'rv:model::name' ) !== null ){
            var currentModel = el.firstChild.getAttribute( 'rv:model::name' );
            var viewId = el.firstChild.getAttribute( 'rv:model::id' );
            // ignore if MODEL is the same actually binded
            if(modelName === currentModel ) return false;
            else{
                // if diferent ...unbind previous import binding and destroy view
                rivets.importedModels[ currentModel ].__views__[ viewId ].unbind();
                delete rivets.importedModels[ currentModel ].__views__[ viewId ];
                el.firstChild.innerHTML = this.view.initialHTML;
            }
        }
        el.firstChild.setAttribute( 'rv:model::name' , modelName );
        el.firstChild.setAttribute( 'rv:model::id' , rivets.importedModels.__count__++ );
        el.firstChild.setAttribute( 'rv:model::scopes' , modelName);

        // import CONTROLLER module if setted &  controller NOT already loaded
        if(modelName.length && !rivets.importedModels.hasOwnProperty(modelName) ){
            System.import( rivets.importedModels.__basePath__ + modelName + '.js' ).then(function(controller){
                // create CONTROLLER module instance
                controller = rivets.importedModels[modelName] = controller.default;
                // assign non enumerable meta property NAME
                Object.defineProperty(controller, '__name__', {  value: modelName, enumerable: false, writable:false,  configurable: false });
                Object.defineProperty(controller, '__views__', {  value: {}, enumerable: false, writable:true,  configurable: false });

                var initialize = false;
                if( rivets.importedModels.__constructor__ !== undefined &&
                    typeof rivets.importedModels[modelName][rivets.importedModels.__constructor__] === 'function' &&
                    rivets.importedModels[modelName].__initialized__ !== true ) initialize = true;

                _bind(el, modelName, initialize);
            });
        }else _bind( el, modelName , false);

        // INTERNAL WRAPPER BINDER
        function _bind(el, modelName, initializeModel){
            console.log( 'rv-controller _BIND ('+modelName+')' );

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
                var parentModel_name = _p[i].getAttribute('rv:model::name');
                if(parentModel_name !== null){
                    bindedObj[parentModel_name] = rivets.importedModels[parentModel_name];
                    scopesList += ' ' + parentModel_name;
                }
            }
            el.firstChild.setAttribute( 'rv:model::scopes' , scopesList );

            // do the bindings!
            rivets.importedModels[modelName].__views__[ el.firstChild.getAttribute('rv:model::id') ] =  rivets.bind( el.firstChild, bindedObj );

            // if has custom constructor/igniter should be executed...
            if(initializeModel){
                rivets.importedModels[modelName][rivets.importedModels.__constructor__]();
                Object.defineProperty(rivets.importedModels[modelName], '__initialized__', {  value: true, enumerable: false, writable:false,  configurable: false });
            }
            return true;
        }

        return void 0;
    },

    unbind: function() {
        console.log('***** rv-controller UNBIND **** ');
        //this.unbind();
        //var modelName = this.el.removeAttribute('rv-controller:bind');
    },

    update: function(models) {
        console.log('***** rv-controller UPDATE ***** ');
        //var _ref1;
        //return (_ref1 = this.nested) !== null ? _ref1.update(models) : void 0;
    }
};


