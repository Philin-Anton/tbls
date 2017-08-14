var express = require('express');
var dummyjson = require('dummy-json');
var args = require('minimist')(process.argv.slice(2));
var limit;

var app = express();

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
      {{/repeat}}\
    ]\
  }';
var respons = dummyjson.parse(template, {partials: myPartials});
respons = JSON.parse(respons);

app.get('/users', function (req, res) {
    res.set('Content-Type', 'application/json');
    switch (true) {
        case Object.keys(req.query).length <= 0: {
            return res.json({
                respons: respons,
                error: null
            });
        }
        case Object.keys(req.query).length > 0: {
            if (req.query.searchName && req.query.search && req.query.sortName && req.query.predicates) {
                var result = respons.filter(search(req.query.searchName, req.query.search));
                result = result.sort(comparator(req.query.sort_name, req.query.predicates));
                return res.json({
                    respons: result,
                    error: null
                });
            }
            if (req.query.searchName && req.query.search) {
                var result = respons.filter(search(req.query.searchName, req.query.search));
                return res.json({
                    respons: result,
                    error: null
                });
            }
            if (req.query.sortName && req.query.predicates) {
                var result = respons.sort(comparator(req.query.sort_name, req.query.predicates));
                return res.json({
                    respons: result,
                    error: null
                });
            }
        }
    }
});

app.put('/people:id', function (req, res) {
    if (req.params.id && req.body.fieldName && req.body.newValue) {
        var result = respons.map((item) => {
            if (item.id == req.params.id) {
                item[req.body.fieldName] = req.body.newValue
            }
        });
        return res.json({
            respons: result,
            error: null
        });
    }
    return res.json({
        respons: null,
        error: {
            text: 'error text'
        }
    });
});

app.listen(3000);