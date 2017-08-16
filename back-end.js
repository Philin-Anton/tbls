import search from './src/core/controllers/search';
import comparator from './src/core/controllers/comparator';
import paginate from './src/core/controllers/pagination';
import update from './src/core/controllers/update';
import express from 'express';
import dummyjson from 'dummy-json';
import './src/core/polyfill/isValid.js';

var bodyParser = require('body-parser');
var args = require('minimist')(process.argv.slice(2));
var limit;

var app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

if (args.limit) {
    limit = args.limit;
}

var myPartials = {
    user: '{\
    "id": {{@index}},\
    "firstName": "{{firstName}}",\
    "lastName": "{{lastName}}",\
    "email": "{{email}}"\
  }'
};

var template = '{\
    "users": [\
      {{#repeat '+ limit +'}}\
        {{> user}}\
      {{/r' +
        '' +
        'epeat}}\
    ]\
  }';
var response = dummyjson.parse(template, {partials: myPartials});
response = JSON.parse(response);

app.get('/users', function (req, res) {
    res.set('Content-Type', 'application/json');
    switch (true) {
        case Object.keys(req.query).length <= 0: {
            var result = Object.assign({}, response, {
                total: response.users.length,
                pageSize: 15
            });
            const {amountPages, data, currentPage} = paginate(result.users, result.currentPage || 0, result.pageSize);
            if(response.users.length > 100){
                result.users = data
            }
            return res.json({
                response: Object.assign({}, result, {
                    currentPage: currentPage,
                    amountPages: amountPages
                }),
                error: null
            });
        }
        case Object.keys(req.query).length > 0: {
            if (req.query.searchField && req.query.searchText && req.query.sortField && req.query.predicates) {
                var users = response.users.filter(search(req.query.searchField, req.query.searchText));
                users = users.sort((a, b) => comparator(a, b, req.query.sortField));
                if(req.query.predicates && JSON.parse(req.query.predicates)){
                    users = users.reverse();
                }
                var result = Object.assign({}, {users: users}, {
                    total: response.users.length,
                    pageSize: 15,
                    searchField: req.query.searchField,
                    searchText: req.query.searchText,
                    sortField: req.query.sortField,
                    predicates: req.query.predicates
                });
                const {amountPages, data, currentPage} = paginate(result.users, req.query.currentPage || 0, result.pageSize);
                if(response.users.length > 100){
                    result.users = data
                }
                return res.json({
                    response: Object.assign({}, result, {
                        currentPage: currentPage,
                        amountPages: amountPages,
                    }),
                    error: null
                });
            }
            if (req.query.searchField && req.query.searchText) {
                var users = response.users.filter(search(req.query.searchField, req.query.searchText));
                var result = Object.assign({}, {users: users}, {
                    total: response.users.length,
                    pageSize: 15,
                    searchField: req.query.searchField,
                    searchText: req.query.searchText,
                    sortField: req.query.sortField,
                    predicates: req.query.predicates
                });
                const {amountPages, data, currentPage} = paginate(result.users, req.query.currentPage || 0, result.pageSize);
                if(response.users.length > 100){
                    result.users = data
                }
                return res.json({
                    response: Object.assign({}, result, {
                        currentPage: currentPage,
                        amountPages: amountPages,
                    }),
                    error: null
                });
            }
            if (req.query.sortField && req.query.predicates) {
                var users = response.users.sort((a, b) => comparator(a, b, req.query.sortField));
                if(req.query.predicates && JSON.parse(req.query.predicates)){
                    users = users.reverse();
                }
                var result = Object.assign({}, {users: users}, {
                    total: response.users.length,
                    pageSize: 15,
                    searchField: req.query.searchField,
                    searchText: req.query.searchText,
                    sortField: req.query.sortField,
                    predicates: req.query.predicates
                });
                const {amountPages, data, currentPage} = paginate(result.users, req.query.currentPage || 0, result.pageSize);
                if(response.users.length > 100){
                    result.users = data
                }
                return res.json({
                    response: Object.assign({}, result, {
                        currentPage: currentPage,
                        amountPages: amountPages,
                    }),
                    error: null
                });
            }
            var result = Object.assign({}, response, {
                total: response.users.length,
                pageSize: 15,
                searchField: req.query.searchField,
                searchText: req.query.searchText,
                sortField: req.query.sortField,
                predicates: req.query.predicates
            });
            const {amountPages, data, currentPage} = paginate(result.users, req.query.currentPage || 0, result.pageSize);
            if(response.users.length > 100){
                result.users = data
            }
            return res.json({
                response: Object.assign({}, response, {
                    currentPage: currentPage,
                    amountPages: amountPages,
                }),
                error: null
            });
        }
    }
});

app.put('/users', function (req, res) {
    res.set('Content-Type', 'application/json');
    console.log(req, req.body);
    const id = req.body.id;
    const fieldName = req.body.fieldName;
    const value = req.body.value;

    response.users = response.users.map(update(id, fieldName, value));
    switch (true) {
        case Object.keys(req.query).length <= 0: {
            var result = Object.assign({}, response, {
                total: response.users.length,
                pageSize: 15
            });
            const {amountPages, data, currentPage} = paginate(result.users, result.currentPage || 0, result.pageSize);
            if(response.users.length > 100){
                result.users = data
            }
            return res.json({
                response: Object.assign({}, result, {
                    currentPage: currentPage,
                    amountPages: amountPages
                }),
                error: null
            });
        }
        case Object.keys(req.query).length > 0: {
            if (req.query.searchField && req.query.searchText && req.query.sortField && req.query.predicates) {
                var users = response.users.filter(search(req.query.searchField, req.query.searchText));
                users = users.sort((a, b) => comparator(a, b, req.query.sortField));
                if(req.query.predicates && JSON.parse(req.query.predicates)){
                    users = users.reverse();
                }
                var result = Object.assign({}, {users: users}, {
                    total: response.users.length,
                    pageSize: 15,
                    searchField: req.query.searchField,
                    searchText: req.query.searchText,
                    sortField: req.query.sortField,
                    predicates: req.query.predicates
                });
                const {amountPages, data, currentPage} = paginate(result.users, req.query.currentPage || 0, result.pageSize);
                if(response.users.length > 100){
                    result.users = data
                }
                return res.json({
                    response: Object.assign({}, result, {
                        currentPage: currentPage,
                        amountPages: amountPages,
                    }),
                    error: null
                });
            }
            if (req.query.searchField && req.query.searchText) {
                var users = response.users.filter(search(req.query.searchField, req.query.searchText));
                var result = Object.assign({}, {users: users}, {
                    total: response.users.length,
                    pageSize: 15,
                    searchField: req.query.searchField,
                    searchText: req.query.searchText,
                    sortField: req.query.sortField,
                    predicates: req.query.predicates
                });
                const {amountPages, data, currentPage} = paginate(result.users, req.query.currentPage || 0, result.pageSize);
                if(response.users.length > 100){
                    result.users = data
                }
                return res.json({
                    response: Object.assign({}, result, {
                        currentPage: currentPage,
                        amountPages: amountPages,
                    }),
                    error: null
                });
            }
            if (req.query.sortField && req.query.predicates) {
                var users = response.users.sort((a, b) => comparator(a, b, req.query.sortField));
                if(req.query.predicates && JSON.parse(req.query.predicates)){
                    users = users.reverse();
                }
                var result = Object.assign({}, {users: users}, {
                    total: response.users.length,
                    pageSize: 15,
                    searchField: req.query.searchField,
                    searchText: req.query.searchText,
                    sortField: req.query.sortField,
                    predicates: req.query.predicates
                });
                const {amountPages, data, currentPage} = paginate(result.users, req.query.currentPage || 0, result.pageSize);
                if(response.users.length > 100){
                    result.users = data
                }
                return res.json({
                    response: Object.assign({}, result, {
                        currentPage: currentPage,
                        amountPages: amountPages,
                    }),
                    error: null
                });
            }
            var result = Object.assign({}, response, {
                total: response.users.length,
                pageSize: 15,
                searchField: req.query.searchField,
                searchText: req.query.searchText,
                sortField: req.query.sortField,
                predicates: req.query.predicates
            });
            const {amountPages, data, currentPage} = paginate(result.users, req.query.currentPage || 0, result.pageSize);
            if(response.users.length > 100){
                result.users = data
            }
            return res.json({
                response: Object.assign({}, response, {
                    currentPage: currentPage,
                    amountPages: amountPages,
                }),
                error: null
            });
        }
    }
});

app.listen(3000);