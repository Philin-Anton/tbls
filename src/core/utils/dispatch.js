'use strict';

import Server from 'worker-loader!../workers';

import stoge from '../store';
import EventDispatcher from '../events/EventDispatcher';
const eventDispatcher  = new EventDispatcher();

function dispatch(actions){
    switch(actions.type){
        case 'SORT_TABLE': {
            return actions.payload
        }
        case 'LOAD_DATA': {
            const { url } = actions.payload.params;
            const server = new Server();
            server.postMessage({url: url});
            server.addEventListener('message', (loadData)=>{
                stoge.stage = loadData;
                eventDispatcher.trigger('RENDER_TABLE', stoge.stage);
                eventDispatcher.trigger('RENDER_PAGINATION', stoge.stage);
            });
        }
    }
}

export default dispatch;