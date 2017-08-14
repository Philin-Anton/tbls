'use strict';

/*global onmessage*/
/*global postMessage*/
/*eslint no-unused-vars: ["error", { "vars": "local" }]*/
onmessage = function(event) {
    const { tableData } = event.data;
    window.console.log(tableData);
}