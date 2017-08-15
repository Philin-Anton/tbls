'use strict';

import ajax from '../api/ajax'
import '../polyfill/isValid';

import search from '../controllers/search'
import comparator from '../controllers/comparator'
import paginate from '../controllers/pagination'
/*global onmessage*/
/*global postMessage*/
/*eslint no-unused-vars: ["error", { "vars": "local"}]*/
onmessage = function(event) {
    const { url, responses, payload } = event.data;
    const { response, catchResponse } = responses;
    let { searchField, searchText, sortField, predicates, currentPage } = payload;
    typeof searchField != 'string' && (searchField = response.searchField);
    typeof searchText != 'string' && (searchText = response.searchText || '');
    typeof sortField != 'string' && (sortField = response.sortField);
    typeof currentPage != 'number' && (currentPage = response.currentPage || 0);
    typeof predicates != 'boolean' && (predicates = JSON.parse(response.predicates || false));

     if(catchResponse.total > 100){
        ajax.get(url, {
            query: {
                searchField, searchText, sortField, predicates, currentPage
            }
        }).then(
            (data) => {
                data = {...data, catchResponse: data.response }
                postMessage(data);
            },
            (data)=>{
                data = {...data, catchResponse: data.response }
                postMessage(data);
            }
        )
    } else {
        if (searchField && searchText && sortField && typeof predicates == 'boolean') {
            let users = catchResponse.users.filter(search(searchField, searchText));
            users = users.sort((a, b) => comparator(a, b, sortField));
            if(predicates){
                users = users.reverse();
            }
            const { amountPages, data, currentPage: page } = paginate(users, currentPage || 0, response.pageSize);
            const result = {
                response: {
                    ...catchResponse,
                    users: data,
                    currentPage: page,
                    amountPages: amountPages,
                    total: users.length,
                    searchField: searchField,
                    searchText: searchText,
                    sortField: sortField,
                    predicates: predicates
                }
            }
            return postMessage(result);
        }
        if (searchField && searchText ) {
            let users = catchResponse.users.filter(search(searchField, searchText));            
            const { amountPages, data, currentPage: page  } = paginate(users, currentPage || 0, response.pageSize);
            const result = {
                response: {
                    ...catchResponse,
                    users: data,
                    currentPage: page,
                    amountPages: amountPages,
                    total: users.length,
                    searchField: searchField,
                    searchText: searchText,
                    sortField: sortField,
                    predicates: predicates
                }
            }
            return postMessage(result);
        }
        if (sortField && typeof predicates == 'boolean' ) {
            let users = catchResponse.users.sort((a, b) => comparator(a, b, sortField));
            if(predicates){
                users = users.reverse();
            }
            const { amountPages, data, currentPage: page  } = paginate(users, currentPage || 0, response.pageSize);
            const result = {
                response: {
                    ...catchResponse,
                    users: data,
                    currentPage: page,
                    amountPages: amountPages,
                    total: users.length,
                    searchField: searchField,
                    searchText: searchText,
                    sortField: sortField,
                    predicates: predicates
                }
            }
            return postMessage(result);
        }
        {
            const { amountPages, data, currentPage } = paginate(catchResponse.users, currentPage || 0, response.pageSize);
            debugger;
            return postMessage({
                response:{
                    ...catchResponse,
                    users: data,
                    currentPage: currentPage,
                    amountPages: amountPages,
                    searchField: searchField,
                    searchText: searchText,
                    sortField: sortField,
                    predicates: predicates,
                    currentPage: currentPage
                }
            });
        }
    }
}