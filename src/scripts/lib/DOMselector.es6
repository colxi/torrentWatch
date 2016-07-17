/**
 * Get the closest matching element up the DOM tree.
 * @param  {Element} elem     Starting element
 * @param  {String}  selector Selector to match against (class, ID, data attribute, or tag)
 * @return {Boolean|Element}  Returns null if not match found
 */

const DOMselector = {
    closest : function ( elem, selector ) {
        // Variables
        let firstChar = selector.charAt(0);
        let supports = 'classList' in document.documentElement;
        let attribute;
        let value;

        // If selector is a data attribute, split attribute from value
        if ( firstChar === '[' ) {
            selector = selector.substr( 1, selector.length - 2 );
            attribute = selector.split( '=' );

            if ( attribute.length > 1 ) {
                value = true;
                attribute[1] = attribute[1].replace( /"/g, '' ).replace( /'/g, '' );
            }
        }

        // Get closest match
        for ( ; elem && elem !== document && elem.nodeType === 1; elem = elem.parentNode ) {
            switch(firstChar){
                // If selector is a class
               case '.' :
                    if ( supports )  if ( elem.classList.contains( selector.substr(1) ) ) return elem;
                    else if ( new RegExp('(^|\\s)' + selector.substr(1) + '(\\s|$)').test( elem.className ) ) return elem;
                    break;
                case '#' :
                     if( elem.id === selector.substr(1) ) return elem;
                     break;
                case '[' :
                    if ( elem.hasAttribute( attribute[0] ) ) {
                        if ( value && elem.getAttribute( attribute[0] ) === attribute[1] ) return elem;
                        else return elem;
                    }
                    break;
                default:
                    // If selector is a tag
                    if ( elem.tagName.toLowerCase() === selector )  return elem;
                    break;
            }
        }
        return null;

    },
    parent :function(elem, selector){
        var selection = closest(elem.parentNode, selector);
        if(typeof selection === 'undefined') return null;
        else return selection;
    },
    find : function(elem, selector){
        let selection = elem.querySelectorAll(selector);
        if(typeof selection === 'undefined') return null;
        else return selection;
    }
};
