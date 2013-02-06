var _     = require('underscore'),
main      = require('redis')
,   _base = require('okdoki/lib/base');

var error = _base.error
, warn    = _base.warn
, log     = _base.log;

var Redis = function () {
  this.cmds   = [];
  this.calls  = [];
  this.replys = {};
  this.is_fin = false;
  this.data   = {}; // Data to be stored by user.
};

function log() {
  console['log'].apply(console, arguments);
}

Redis.client = main.createClient(5100);

Redis.read_records_from_ids = function (raw_ids, on_fin) {
  var ids = _.compact( raw_ids );

  if (ids.length < 1)
    return on_fin([]);

  var r_multi = Redis.client.multi();
  _.each(ids, function (id) {
    r_multi.hgetall(id);
  });
  r_multi.exec(function (err, raw_records) {
    if (err) error(err);
    var records = [];
    _.each((raw_records || []), function (rec, i) {
      if (!rec) // record expired during retrieval
        return;
      var created_at = ids[i].split(':').pop();
      if (!rec.created_at && created_at)
        rec.created_at = created_at;
      records.push([ ids[i], rec ]);
    });

    return on_fin(records);
  });
};

Redis.pop_records_from_list = function (key, on_fin) {
  Redis.client.llen(key, function (err, l) {
    if (err) error(err);
    if (!l || l < 1)
      return on_fin([]);

    var ids_multi = Redis.client.multi();
    while(l > 0) {
      ids_multi.lpop(key);
      l -= 1;
    }

    ids_multi.exec(function (err, raw_ids) {
      if (err) error(err);
      Redis.read_records_from_ids((raw_ids || []), on_fin);
    });
  });
};

Redis.read_records_from_hash = function (key, on_fin) {
  Redis.client.hkeys(key, function (err, keys) {
    if (err) error(err);
    Redis.read_records_from_ids(keys || [], on_fin);
  });
};

// process.on('exit', function () {
  // log('Closing redis.');
  // Redis.client.quit();
// });

Redis.new = function () {
  return (new Redis);
};

Redis.prototype.on_fin = function (func) {

  if (arguments.length === 0) {
    if (this.is_fin)
      throw new Error('Can not call on_fin event multiple times.');
    if (!this.fin)
      return null;
    var fin_result = this.fin(this.replys, this);
    this.fin = null;
    this.is_fin = (this.cmds.length === 0);
    return fin_result;
  }

  if (this.fin)
    throw new Error('Can only add a fin function once.');
  this.fin = func;
  return this.fin;
};

Redis.prototype.add = function( cmd_id, r_func_name, raw_args, on_fin, on_err ) {
  var me      = this;
  var args    = raw_args.slice();
  var cont    = true;
  var func    = function (err, reply) {

    me.replys[cmd_id] = {
      success : !err,
      reply   : reply,
      cmd     : r_func_name,
      args    : raw_args
    };

    if (err) {
      if (on_err)
        cont = on_err(err, reply, me);
      else
        log('Redis err:', err, 'Reply: ', reply, 'cmd: ', r_func_name, 'args: ', raw_args, 'id: ', cmd_id);

      if (!cont)
        return cont;
    }

    if (on_fin)
      on_fin(reply, me);

    me.cmds.pop();
    if (me.cmds.length === 0) {
      me.on_fin();
    }
    me.exec();
  };

  args.push(func);
  me.cmds.push(cmd_id);
  me.calls.push([r_func_name, args]);
};

Redis.prototype.exec = function (fin) {
  var c  = null;
  var me = this;

  if (fin)
    this.on_fin(fin);

  while((c = this.calls.pop()) || c) {
    var meth = Redis.client[c[0]];
    if (!meth)
      throw new Error('Unknown method: ' + c[0]);
    Redis.client[c[0]].apply(Redis.client, c[1]);
  }
};

exports.Redis = Redis;

