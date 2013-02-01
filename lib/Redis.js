var main    = require('redis');

var Redis = function () {
  this.cmds   = [];
  this.calls  = [];
  this.replys = {};
  this.is_fin = false;
};

Redis.client = main.createClient(5100);

Redis.new = function () {
  return (new Redis);
};

Redis.prototype.on_fin = function (func) {

  if (arguments.length === 0) {
    if (this.is_fin)
      throw new Error('Can not call on_fin event multiple times.');
    this.is_fin = true;
    return this.fin(this.replys, this);
  }

  if (this.fin)
    throw new Error('Can only add a fin function once.');
  this.fin = func;
  return this.fin;
};

Redis.prototype.add = function( cmd_id, r_func_name, raw_args, on_fin, on_err ) {
  var me   = this;
  var args = raw_args.slice();
  var cont = true;
  var func = function (err, reply) {
    me.cmds.pop();

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

    if (me.cmds.length === 0 && me.fin)
      me.on_fin();
  };

  args.push(func);
  me.cmds.push(cmd_id);
  me.calls.push([r_func_name, args]);
};

Redis.prototype.exec = function (fin) {
  if (fin)
    this.on_fin(fin);
  var calls = this.calls.slice();
  var c     = null
  while((c = calls.pop()) || c) {
    Redis.client[c[0]].apply(Redis.client, c[1]);
  }
};

exports.Redis = Redis;

