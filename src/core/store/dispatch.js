'use strict';

import Load from 'worker-loader!../workers/load';
import Filter from 'worker-loader!../workers/filter';

import EventDispatcher from '../events/EventDispatcher';

import Store from './store';

function dispatch(store, actions){
    store = new Store(store);
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
                if(typeof data.catchResponse == 'object'){
                    store.catchResponse = data.catchResponse;
                }
                eventDispatcher.trigger(createEvetName('onRenderTable'), store);
                eventDispatcher.trigger(createEvetName('onRenderPagination'), store);
            });
            break;
        }
        case 'LOAD_TABLE': {
            const load = new Load();
            const responses={
                response: store.response,
                catchResponse: store.catchResponse
            }
            load.postMessage({url: initParams.url, responses});
            load.addEventListener('message', ({data})=>{
                const eventDispatcher = new EventDispatcher();
                store.response = data.response;
                if(typeof data.catchResponse == 'object'){
                    store.catchResponse = data.catchResponse;
                }
                eventDispatcher.trigger(createEvetName('onRenderTable'), store);
                eventDispatcher.trigger(createEvetName('onRenderPagination'), store);
            });
            break;
        }
    }
}

export default dispatch;