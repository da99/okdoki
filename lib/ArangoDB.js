
var _ = require('underscore')
, request = require('request')
;



var on_complete = function (flow, action) {
  return function (err, res, data) {
    if (err)
      return flow.error(data);

    if (!data.error || (action != 'delete' && data.error && data.errorMessage.indexOf("unknown collection '") === 0)) {
      flow.finish(data);
    } else {
      if (data.error)
        flow.error(data.code + ': ' + data.errorMessage + ' ' + JSON.stringify(data), res);
      else
        flow.error('Unknown error: ' + raw_data);
    }
  };
};


var A = exports.ArangoDB = function () {};
A.mb  = function (num) { return num * 1024 * 1024; };
A.url = function (path) {
  return "http://localhost:8529/_api" + path;
};

A.new = function (coll_name) {
  var a = new A();
  a.name = coll_name;

  return a;
};

A.prototype.create_index = function (data, flow) {
  var name = this.name;
  request.post({
    url  : A.url('/index?collection=' + name),
    json : true,
    body : data
  }, on_complete(flow));
};

A.prototype.create_collection = function (flow) {
  var name = this.name;
  request.post({
    url: A.url('/collection'),
    json: true,
    body: {
      name: name,
      waitForSync: true,
      journalSize: A.mb(4)
    }
  }, on_complete(flow));
};


A.prototype.delete_collection = function (flow) {
  var name = this.name;

  request.del({
    url: A.url('/collection/' + name),
    json: true
  }, on_complete(flow, 'delete'));

  return true;
};


A.prototype.create = function (data, flow) {
  var name = this.name;

  request.post({
    url: A.url('/document?collection=' + name),
    json: true,
    body: data
  }, on_complete(flow));
};

A.read_list = function (flow) {
  request.get({
    url: A.url("/collection"),
    json: true
  }, on_complete(flow));
};

A.prototype.read = function (id, flow) {
  var name = this.name;

  request.get({
    url: A.url("/document/" + name + '/' + id),
    json: true
  }, on_complete(flow));
};

A.prototype.read_list_indexs = function (flow) {
  var me = this;
  request.get({
    url: A.url('/index?collection=' + me.name),
    json: true
  }, on_complete(flow));
};


















