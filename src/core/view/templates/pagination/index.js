'use strict';

import CreateComponent from '../../createComponent';
//import EventDispatcher from '../../../events/EventDispatcher';

function Parination(store, props={}) {
    
    const parination = new CreateComponent({
        isEventsPushing: true,
        store: store,
        tagName: 'div',
        domAttr: {
            className: 'parination-wrapper'
        },
        ...props
    });

    return parination.getElem();
}

export default Parination;