'use strict';

const model = {
    initParams: {},
    dispatch: function(){},
    catchResponse:{
        users: [],
        currentPage: 0,
        total: 0,
        pageSize: 15,
        amountPages: 0
    },
    response: {
        users: [],
        currentPage: 0,
        total: 0,
        pageSize: 15,
        amountPages: 0
    }
}

function Store(store = model) {
    return {
        reset() {
           return store = model;
        },
        get initParams(){
            return store.initParams
        },
        set initParams(initParams){
            return store.initParams = initParams
        },
        get dispatch(){
            return store.dispatch.bind(null, store)
        },
        set dispatch(dispatch){
            return store.dispatch = dispatch
        },
        get all() {
            return store;
        },
        get response() {
            return store.response
        },
        set response(response) {
            return store.response = response
        },
        get catchResponse() {
            return store.catchResponse
        },
        set catchResponse(response) {
            return store.catchResponse = response
        } 
    }
}

export default Store;