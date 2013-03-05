#!/usr/bin/env node
require("okdoki/bin/dev/is_dev");

var _           = require('underscore')
, _s            = require('underscore.string')
, rest          = require('request')
, A             = require('okdoki/lib/ArangoDB').ArangoDB
;

var log = function () {
  if (process.env.QUIET)
    return false;
  console.log.apply(console, arguments);
}

var creates = _.uniq(_s.words(" \
  customers  \
  labels     \
  labelings  \
  subscribes \
  posts      \
  comments   \
  screen_names \
"));

var deletes = _.uniq(_s.words(" \
  users     \
  subs      \
  articles  \
  learn_it  \
"));

var common = _.intersection(creates, deletes);
if (common.length)
  throw new Error("Names found in both creates and deletes: " + common.join(', '));

var indexs = [ {coll: 'screen_names', type: 'hash', fields: ['screen_name'], unique: true} ];
var indexs_count = indexs.slice();
var create_count = [];
var delete_count = [];
var reset_count  = _.pluck(indexs, 'coll');

function err(msg, res) {
  log(msg);
}


function del() {

  var next_coll = delete_count.pop();

  // create collection
  if (!next_coll)
    return create();;

  var c = A.new(next_coll);
  c.delete_collection({
    error : err,
    finish : function (data) {
      log('Deleted: ', next_coll, data);
      del();
    }
  });
  return true;
}

function create() {
  var next_coll = create_count.pop();
  if (!next_coll)
    return create_indexs();;
  var c = A.new(next_coll);
  c.create_collection({
    error : err,
    finish : function (data) {
      log('Created: ', next_coll, data);
      create();
    }
  });
}

function create_indexs() {

  if (!indexs_count.length)
    return ;

  _.each(indexs_count, function (next_index) {
    A.new(next_index.coll).create_index(next_index, {
      error: err,
      finish: function (data) {
        log('created index:' + JSON.stringify(data))
      }
    });
  });

}

// get collection list
A.read_list({error: err, finish: function (data) {

  var alives = _.filter(_.keys(data.names), function(name) { return name.indexOf('_') !== 0; });
  create_count = _.uniq( create_count.concat(_.difference(creates, alives)) ).concat(reset_count);
  delete_count = _.uniq( _.intersection(alives, deletes) ).concat(reset_count);

  del();
}});












