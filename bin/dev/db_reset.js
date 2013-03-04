#!/usr/bin/env node
require("okdoki/bin/dev/is_dev");

var _           = require('underscore')
, _s            = require('underscore.string')
, rest          = require('request')
;

console.log("reseting");

var colls = _.uniq(_s.words(" \
  customers  \
  labels     \
  labelings  \
  subscripes \
  articles   \
  comments   \
\
  users \
  subs  \
  posts  \
  learn_it  \
"));

function err(err, res, data) {
  if (err) {
    console.log("err: ", err);
    console.log("response: ", JSON.stringify(res));
    console.log("data: ", JSON.stringify(data));
  }
}

function succ(res, data) {
  data = JSON.parse(data || '{}');

  if (data.error && data.errorMessage.indexOf("unknown collection '") === 0) {
    console.log("Already deleted: " + data.errorMessage.replace("unknown collection ", ''));
    return del();
  }

  if (data.error) {
    console.log('error: ', data.code, ':', data.errorMessage );
    return false;
  }

  console.log("data: ", JSON.stringify(data));
  return del();
}

function complete(err, res, data) {
  if (err)
    return err(err, res, data);
  else
    return succ(res, data);
}

function del() {
  var next_table = colls.pop();
  if (!next_table) {
    return console.log('Finished reseting db.');
  }
  console.log("Deleteing " + next_table);

  rest.del("http://localhost:8529/_api/collection/" + next_table, complete);
}

del();
