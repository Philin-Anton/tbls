'use strict';

import Init from './init';
import $ from './view/getElement'

(function (arr) {
  const defaultInitParams = {
    url: 'http://localhost:3000/users',
    theme: 'light',
    searchField: 'firstName',
    sortField: 'firstName',
    predicates: false,
    currentPage: 0
  }
  arr.forEach(function (item) {
    if (item.hasOwnProperty('tableInit')) {
      return;
    }
    Object.defineProperty(item, 'tableInit', {
      configurable: true,
      enumerable: true,
      writable: true,
      value: function tableInit(initParams={}) {
        if(this.nodeName.toLocaleUpperCase() != 'TABLE'){
            throw new Error('Element should be Table!')
        }
        if(typeof initParams.name != 'string'){
            throw new Error('Element should be options "name"!')
        }
        initParams = Object.assign({}, defaultInitParams, initParams);
        const init = new Init(initParams);
        this.parentNode.replaceChild(init, this);
      }
    });
  });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);

export { $ };