'use strict';

import '../polyfill';
import search from './search';

function wrapper(docFrag, params ){
    const { theme } = params
    const newDiv = document.createElement('div', {
        class: theme
    });

    newDiv.appendChild(search());
    docFrag.appendChild(newDiv);

    return docFrag
}

export default wrapper;