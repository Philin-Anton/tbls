
'use strict';

document.createElement = function(elementName, attributes) {
    const element = Document.prototype.createElement.call(document, elementName);

    if(attributes && !(attributes instanceof Object)) {
        throw Error('CreateElement must be the first arguments object');	
    } else if(attributes) {
        for(let attr of Object.keys(attributes)) {
            if(element[attr] !== undefined) {
                element[attr] = attributes[attr];
            } else if (!element.hasAttribute(attr)) {
                element.setAttribute(attr, attributes[attr]);
            }
        }
    }

    return element;
}