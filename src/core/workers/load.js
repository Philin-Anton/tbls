'use strict';

import ajax from '../api/ajax'
import paginate from '../controllers/pagination'
/*global onmessage*/
/*global postMessage*/
/*eslint no-unused-vars: ["error", { "vars": "local"}]*/
onmessage = function(event) {
    const { url, responses, payload={}} = event.data;
    const { response } = responses;
    let { searchField, searchText, sortField, predicates, currentPage } = payload;
    typeof searchField != 'string' && (searchField = response.searchField);
    typeof searchText != 'string' && (searchText = response.searchText || '');
    typeof sortField != 'string' && (sortField = response.sortField);
    typeof predicates != 'boolean' && (predicates = response.predicates);
    typeof currentPage != 'number' && (currentPage = response.currentPage);
    ajax.get(url, {
        query: {
            searchField, searchText, sortField, predicates, currentPage
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
}