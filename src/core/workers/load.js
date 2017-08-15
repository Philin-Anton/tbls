'use strict';

import ajax from '../api/ajax'
/*global onmessage*/
/*global postMessage*/
/*eslint no-unused-vars: ["error", { "vars": "local"}]*/
onmessage = function(event) {
    const { url } = event.data;
    ajax.get(url).then(
        (data)=>{
            data = {...data, catchResponse: data.response }
            postMessage(data);
        },
        (data)=>{
            data = {...data, catchResponse: data.response }
            postMessage(data);
        }
    )
}