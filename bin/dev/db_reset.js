#!/usr/bin/env node
require("okdoki/bin/dev/is_dev");

var _           = require('underscore')
, _s            = require('underscore.string')
, rest          = require('request')
, A             = require('okdoki/lib/ArangoDB').ArangoDB
;

var colls = _.uniq(_s.words(" \
  customers  \
  labels     \
  labelings  \
  subscribes \
  articles   \
  comments   \
  screen_names \
\
  users \
  subs  \
  posts  \
  learn_it  \
"));

var indexs = {'screen_names': {type: 'hash', fields: ['screen_name'], unique: true}};
var indexs_count = [];

function err(msg, res) {
  console.log(msg);
}

function succ(res, data) {
  data = JSON.parse(data || '{}');

  if (data.error && data.errorMessage.indexOf("unknown collection '") === 0) {
    // console.log("Already deleted: " + data.errorMessage.replace("unknown collection ", ''));
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


var flow_for_create = function (c) {
  return {
    error  : err,
    finish : function (data) {
      return del();
    }
  };
}

var flow_for_delete = function (c) {
  return {
    error  : err,
    finish : function (data) {
      if (!(data.code === 200 && data.error === false) && (data.errorMessage || '').indexOf('unknown collection') === -1)
        console.log("data: ", JSON.stringify(data));
      c.create_collection(flow_for_create(c));
    }
  };
};

var flow_for_index_create = function (c) {
  return {
    error : err,
    finish : function (data) {
      console.log(data);
      index_count.pop();
      if (index_count.length)
        del();
      else
        console.log('Finished reseting db.');

    }
  };
};

function del() {
  var next_table = colls.pop();
  if (!next_table) {

    _.map(indexs, function (data, coll) {
      indexs_count.push(coll);
      return coll;
    });

    _.map(indexs, function (data, coll) {
      return A.new(coll).create_index(data, flow_for_index_create(c));
    });
  }

  var c = A.new(next_table);
  console.log('deleteing:', next_table);
  c.delete_collection(flow_for_delete(c));
}

del();
