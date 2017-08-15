'use strict';

import CreateComponent from '../createComponent';

function wrapper(store, props={}){
    const wrapper = new CreateComponent({
        store: store,
        tagName: 'div',
        domAttr: {
            className: 'wrapper'
        },
        ...props
    })

    return wrapper.getElem();
}

export default wrapper;