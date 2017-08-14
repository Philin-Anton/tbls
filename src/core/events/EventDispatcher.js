'use strict';

import CustomEvent from 'custom-event';

export default function EventDispatcher(elem = window){
    this.off = elem.removeEventListener.bind(elem);
    this.on = elem.addEventListener.bind(elem);
    this.trigger = function(eventName, payload){
        if( !eventName ) return;
        const e = new CustomEvent(eventName, {
            detail: payload
        });
        elem.dispatchEvent(e);
    }
}