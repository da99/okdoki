var main    = require('redis');

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
      success: !err,
      reply: reply,
      cmd: r_func_name,
      args: raw_args
    };

    if (err) {
      if (on_err)
        cont = on_err(err, reply, me);
      else
        log('Redis err:', err, 'Reply: ', reply);

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
  var c = null;

  if (fin)
    this.on_fin(fin);

  while((c = this.calls.pop()) || c) {
    var meth = Redis.client[c[0]];
    if (!meth)
      throw new Error('Unknown method: ' + c[0]);
    meth.apply(Redis.client, c[1]);
  }
};

exports.Redis = Redis;

