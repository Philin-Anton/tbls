'use strict';

import ajax from '../api/ajax'
import search from '../controllers/search'
import comparator from '../controllers/comparator'
/*global onmessage*/
/*global postMessage*/
/*eslint no-unused-vars: ["error", { "vars": "local"}]*/
onmessage = function(event) {
    const { url, responses, payload } = event.data;
    const { catchResponse } = responses;
    debugger;
     if(catchResponse.total > 100){
        ajax.get(url, {
            query: {
                ...payload
            }
        }).then(
            (data)=>{
                data = {...data, catchResponse: data.response }
                postMessage(data);
            },
            (data)=>{
                data = {...data, catchResponse: data.response }
                postMessage(data);
            }
        )
    } else {
        let { searchField, searchText, sortField, predicates } = payload;
        typeof searchField != 'string' && (searchField = catchResponse.searchField);
        typeof searchText != 'string' && (searchText = catchResponse.searchText);
        typeof sortField != 'string' && (sortField = catchResponse.sortField);
        typeof predicates != 'boolean' && (predicates = catchResponse.predicates);

        if (searchField && searchText && sortField && predicates) {
            let users = catchResponse.users.filter(search(searchField, searchText));
            users = users.sort(comparator(sortField, predicates));
            const data = {
                response: {
                    ...catchResponse,
                    users: users,
                    currentPage: 0,
                    total: users.length
                },
                catchResponse: catchResponse
            }
            return postMessage(data);
        }
        if (searchField && searchText ) {
            let users = catchResponse.users.filter(search(searchField, searchText));
            const data = {
                response: {
                    ...catchResponse,
                    users: users,
                    currentPage: 0,
                    total: users.length
                },
                catchResponse: catchResponse
            }
            return postMessage(data);
        }
        if (sortField && predicates ) {
            let users = catchResponse.users.sort(comparator(sortField, predicates));
            const data = {
                response: {
                    ...catchResponse,
                    users: users,
                    total: users.length
                },
                catchResponse: catchResponse
            }
            return postMessage(data);
        }
        return postMessage({
            ...responses,
            response: {
                ...catchResponse
            }
        });
    }
}