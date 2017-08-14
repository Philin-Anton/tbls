'use strict';
import wrapper from '../templates/wrapper';

import dispatch from '../../utils/dispatch';

(function (arr) {
  const defaultParams = {
    url: 'http://localhost:3000',
    theme: 'light',
    searchField: 'firstName'
  }
  arr.forEach(function (item) {
    if (item.hasOwnProperty('tableInit')) {
      return;
    }
    Object.defineProperty(item, 'tableInit', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function tableInit(params={}) {
        if(this.nodeName.toLocaleUpperCase() != 'TABLE'){
          window.console.warn('Element should be Table!');
        }
        params = Object.assign({}, defaultParams, params);

        const docFrag = wrapper(document.createDocumentFragment(), params);

        this.parentNode.replaceChild(docFrag, this);

        dispatch({
          type: 'LOAD_DATA',
          payload: {
            params
          }
        })
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);