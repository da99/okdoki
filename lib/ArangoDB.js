
var _ = require('underscore')
, request = require('request')
;

// ****************************************************************
// ****************** HELPERS *************************************
// ****************************************************************



var on_complete = function (flow, action_or_func) {
  if (_.isFunction(action_or_func)) {
    var action = null;
    var fin = action_or_func;
  } else {
    var action = action_or_func;
    var fin    = null;
  }

  if (!fin)
    fin = flow.finish

  return function (err, res, data) {
    if (err)
      return flow.error(data);

    if (!data.error || (action != 'delete' && data.error && data.errorMessage.indexOf("unknown collection '") === 0)) {
      fin(data);
    } else {
      if (data.error)
        flow.error(data.code + ': ' + data.errorMessage + ' ' + JSON.stringify(data), res);
      else
        flow.error('Unknown error: ' + raw_data);
    }
  };
};

// ****************************************************************
// ****************** MAIN STUFF **********************************
// ****************************************************************

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


// ****************************************************************
// ****************** CREATE **************************************
// ****************************************************************

A.prototype.create = function (data, flow) {
  var name = this.name;

  request.post({
    url: A.url('/document?collection=' + name),
    json: true,
    body: data
  }, on_complete(flow));
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


// ****************************************************************
// ****************** READ ****************************************
// ****************************************************************

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

A.prototype.read_by_example = function (doc, flow) {
  var me = this;
  request.put({
    url: A.url("/simple/by-example"),
    json: true,
    body: {
      collection : me.name,
      example: doc
    }
  }, on_complete(flow, function (data) {
    flow.finish(data.result);
  }));
};

A.prototype.read_list_all_ids = function (flow) {
  var me = this;
  request.get({
    url: A.url("/document?collection=" + me.name),
    json: true
  }, on_complete(flow, function (data) {
      flow.finish(data.documents);
  }))
};

A.prototype.read_list_indexs = function (flow) {
  var me = this;
  request.get({
    url: A.url('/index?collection=' + me.name),
    json: true
  }, on_complete(flow));
};

// ****************************************************************
// ****************** DELETE **************************************
// ****************************************************************


A.prototype.del = function (id, flow) {
  var me = this;
  request.del({
    url: A.url("/document/" + me.name + '/' + id),
    json: true
  }, on_complete(flow, 'delete'));
};

A.prototype.delete_all = function (flow) {
  var me = this;
  var err = function () { return flow.error.apply(flow, arguments); };
  me.read_list_all_ids({
    error: err,
    finish: function (docs) {
      var ids = [];
      if (!docs.length)
        flow.finish(docs);
      _.each(docs, function (path) {
        ids.push(path.split('/').pop());
        me.del(ids[ids.length - 1], {
          error: err,
          finish : function (data) {
            docs.pop();
            if (!docs.length)
              flow.finish(ids);
          }
        });
      });
    }
  });
};


A.prototype.delete_collection = function (flow) {
  var name = this.name;

  request.del({
    url: A.url('/collection/' + name),
    json: true
  }, on_complete(flow, 'delete'));

  return true;
};

















