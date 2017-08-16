Run:
1) npm i
2.1) npm start - starts run server
2.2) npm run start:back - starts run mock server (in new console window)

3) Open package.json
4) Look at this line:
"start:back": "node_modules/.bin/babel-node --presets es2015 back-end.js --limit={number}",
where {number} the number of objects in the collection.


