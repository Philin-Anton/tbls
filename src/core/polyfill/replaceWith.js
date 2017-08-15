'use strict';

(function (arr) {
    arr.forEach(function (item) {
        if (item.hasOwnProperty('replaceWith')) {
            return;
        }
        Object.defineProperty(item, 'replaceWith', {
            configurable: true,
            enumerable: true,
            writable: true,
            value: function replaceWith() {
                const argArr = Array.from(arguments);
                const docFrag = document.createDocumentFragment();

                argArr.forEach(function (argItem) {
                    const isNode = argItem instanceof Node;
                    docFrag.appendChild(isNode ? argItem : document.createTextNode(String(argItem)));
                });

                this.parentNode.replaceChild(docFrag, this);
            }
        });
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);