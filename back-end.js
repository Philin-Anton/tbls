import search from './src/core/controllers/search';
import comparator from './src/core/controllers/comparator';
import express from 'express';
import dummyjson from 'dummy-json';

var args = require('minimist')(process.argv.slice(2));
var limit;

var app = express();

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

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
            return res.json({
                response: Object.assign({}, response, {
                    currentPage: 0,
                    total: response.users.length,
                    pageSize: 15
                }),
                error: null
            });
        }
        case Object.keys(req.query).length > 0: {
            if (req.query.searchField && req.query.searchText && req.query.sortField && req.query.predicates) {
                var users = response.users.filter(search(req.query.searchField, req.query.searchText));
                users = users.sort(comparator(req.query.sortField, req.query.predicates));
                return res.json({
                    response: Object.assign({}, {users:users}, {
                        currentPage: 0,
                        total: response.users.length,
                        pageSize: 15,
                        searchField: req.query.searchField,
                        searchText: req.query.searchText,
                        sortField: req.query.sortField,
                        predicates: req.query.predicates
                    }),
                    error: null
                });
            }
            if (req.query.searchField && req.query.searchText) {
                var users = response.users.filter(search(req.query.searchField, req.query.searchText));
                return res.json({
                    response: Object.assign({}, {users:users}, {
                        currentPage: 0,
                        total: response.users.length,
                        pageSize: 15,
                        searchField: req.query.searchField,
                        searchText: req.query.searchText
                    }),
                    error: null
                });
            }
            if (req.query.sortField && req.query.predicates) {
                var users = response.users.sort(comparator(req.query.sortField, req.query.predicates));
                return res.json({
                    response: Object.assign({}, {users:users}, {
                        currentPage: 0,
                        total: response.users.length,
                        pageSize: 15,
                        sortField: req.query.sortField,
                        predicates: req.query.predicates
                    }),
                    error: null
                });
            }
            return res.json({
                response: Object.assign({}, response, {
                    currentPage: 0,
                    total: response.users.length,
                    pageSize: 15,
                    searchField: req.query.searchField,
                    searchText: req.query.searchText
                }),
                error: null
            });
        }
    }
});

app.put('/users:id', function (req, res) {
    if (req.params.id && req.body.fieldName && req.body.newValue) {
        var result = response.map((item) => {
            if (item.id == req.params.id) {
                item[req.body.fieldName] = req.body.newValue
            }
        });
        return res.json({
            response: {
                response: Object.assign({}, result, {
                    currentPage: 0,
                    total: response.users.length,
                    pageSize: 15
                }),
                currentPage: 0,
                total: response.users.length,
                pageSize: 15
            },
            error: null
        });
    }
    return res.json({
        response: null,
        error: {
            text: 'error text'
        }
    });
});

app.listen(3000);