
'use strict';

import EventDispatcher from '../../../events/EventDispatcher';

const eventDispatcher  = new EventDispatcher();

export default function renderTable(params){
    const table = document.createElement('table', {
        class: 'table'
    });

    eventDispatcher.on('RENDER_TABLE', (event) => {
        const { detail } = event;
        debugger;
    });

    return table;        
}