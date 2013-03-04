
var _ = require('underscore')
, request = require('request')
;



var A = exports.ArangoDB = function () {
  this.data = {collection_name: null};
  return this;
};

A.mb = function (num) {
  return num * 1024 * 1024;
};
A.default_address = "http://localhost:8529";

A.new = function (coll_name) {
  var a = new A();
  a.data.collection_name = coll_name;

  return a;
};


A.prototype.create_collection = function (flow) {
  var name = this.data.collection_name;
  request.post({
    url: A.default_address + '/_api/collection',
    json: true,
    body: {
      name: name,
      waitForSync: true,
      journalSize: A.mb(4)
    }
  }, on_complete(flow));
};

A.prototype.delete_collection = function (flow) {
  var name = this.data.collection_name;

  request.del({
    url: A.default_address + '/_api/collection/' + name,
    json: true
  }, on_complete(flow));

  return true;
};


var on_complete = function (flow) {
  return function (err, res, data) {
    if (err)
      return flow.error(data);

    if (!data.error || (data.error && data.errorMessage.indexOf("unknown collection '") === 0)) {
      flow.finish(data);
    } else {
      if (data.error)
        flow.error(data.code + ': ' + data.errorMessage + ' ' + JSON.stringify(data), res);
      else
        flow.error('Unknown error: ' + raw_data);
    }
  };
};
