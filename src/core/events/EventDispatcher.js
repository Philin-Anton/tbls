'use strict';

import CustomEvent from 'custom-event';

export default function EventDispatcher(elem = document){
    this.off = elem.removeEventListener.bind(elem);
    this.on = elem.addEventListener.bind(elem);
    this.trigger = (eventName, payload) => {
        if( !eventName ) return;
        const e = new CustomEvent(eventName, {
            detail: payload,
            bubbles: true
        });
        elem.dispatchEvent(e);
    }
}