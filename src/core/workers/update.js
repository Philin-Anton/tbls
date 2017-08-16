'use strict';

import ajax from '../api/ajax'
import '../polyfill/isValid';
import search from '../controllers/search'
import update from '../controllers/update'
import comparator from '../controllers/comparator'
import paginate from '../controllers/pagination'
/*global onmessage*/
/*global postMessage*/
/*eslint no-unused-vars: ["error", { "vars": "local"}]*/
onmessage = function(event) {
    const { url, responses, payload={}} = event.data;
    const { response, catchResponse } = responses;
    let { searchField, searchText, sortField, predicates, currentPage, id, value, fieldName } = payload;
    typeof searchField != 'string' && (searchField = response.searchField);
    typeof searchText != 'string' && (searchText = response.searchText || '');
    typeof sortField != 'string' && (sortField = response.sortField);
    typeof predicates != 'boolean' && (predicates = response.predicates);
    typeof currentPage != 'number' && (currentPage = response.currentPage);
     if(catchResponse.total > 100){
        ajax.put(url, {
            query: {
                searchField, searchText, sortField, predicates, currentPage
            },
            data:{
                id, value, fieldName
            }
        }).then(
            (result)=>{
                const { amountPages, data, currentPage } = paginate(result.response.users, result.response.currentPage || 0, result.response.pageSize);
                result = {
                    response: {
                        ...result.response,
                        users: data,
                        currentPage: currentPage,
                        amountPages: amountPages,
                        searchField: searchField,
                        searchText: searchText,
                        sortField: sortField,
                        predicates: predicates,
                        currentPage: currentPage
                    },
                    catchResponse: result.response
                }
                postMessage(result);
            },
            (data)=>{
                data = {...data, catchResponse: data.response }
                postMessage(data);
            }
        )
     } else {
         catchResponse.users = catchResponse.users.map(update(id, fieldName, value));
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