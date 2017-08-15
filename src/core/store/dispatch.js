'use strict';

import Load from 'worker-loader!../workers/load';
import Filter from 'worker-loader!../workers/filter';

import EventDispatcher from '../events/EventDispatcher';

function dispatch(store, actions){
    const { initParams } = store;

    function createEvetName(name){
        return `${name}:${initParams.name}`
    }

    switch(actions.type){
        case 'FILTER_TABLE': {
            const filter = new Filter();
            const responses={
                response: store.response,
                catchResponse: store.catchResponse
            }
            filter.postMessage({url: initParams.url, responses:responses, payload: actions.payload});
            filter.addEventListener('message', ({data})=>{
                const eventDispatcher = new EventDispatcher();
                debugger;
                store.response = data.response;
                store.catchResponse = data.catchResponse;
                eventDispatcher.trigger(createEvetName('onRenderTable'), store);
                eventDispatcher.trigger(createEvetName('onRenderPagination'), store);
            });
            break;
        }
        case 'LOAD_TABLE': {
            const load = new Load();
            load.postMessage({url: initParams.url});
            load.addEventListener('message', ({data})=>{
                const eventDispatcher = new EventDispatcher();
                store.response = data.response;
                store.catchResponse = data.catchResponse;
                eventDispatcher.trigger(createEvetName('onRenderTable'), store);
                eventDispatcher.trigger(createEvetName('onRenderPagination'), store);
            });
            break;
        }
    }
}

export default dispatch;