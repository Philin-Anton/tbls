'use strict';

import Load from 'worker-loader!../workers/load';
import Filter from 'worker-loader!../workers/filter';
import Update from 'worker-loader!../workers/update';

import EventDispatcher from '../events/EventDispatcher';

import Store from './store';

function dispatch(store, actions){
    store = new Store(store);
    const { initParams } = store;

    function createEvetName(name){
        return `${name}:${initParams.name}`
    }

    switch(actions.type){
        case 'CONTROL_COLUMN': {
            const { isVisible, value, fieldName, index } = actions.payload;
            if(isVisible){
                initParams.sequenceColumn.splice(index, 0, {value, fieldName});
            } else {
                initParams.sequenceColumn.splice(index, 1);
            }
            const eventDispatcher = new EventDispatcher();
            eventDispatcher.trigger(createEvetName('onRenderTable'), store);

        }
        case 'EDIT_TABLE': {
            const update = new Update();
            const responses={
                response: store.response,
                catchResponse: store.catchResponse
            }
            update.postMessage({url: initParams.url, responses:responses, payload: actions.payload});
            update.addEventListener('message', ({data})=>{
                store.response = data.response;
                if(typeof data.catchResponse == 'object'){
                    store.catchResponse = data.catchResponse;
                }
                //const eventDispatcher = new EventDispatcher();
                //eventDispatcher.trigger(createEvetName('onRenderTable'), store);
            });
            break;
        }
        case 'FILTER_TABLE': {
            const filter = new Filter();
            const responses={
                response: store.response,
                catchResponse: store.catchResponse
            }
            filter.postMessage({url: initParams.url, responses:responses, payload: actions.payload});
            filter.addEventListener('message', ({data})=>{
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