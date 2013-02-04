
var CB  = null
, _     = require('underscore')
, pg    = require('okdoki/lib/POSTGRESQL')
, log   = require('okdoki/lib/base').log
, warn  = require('okdoki/lib/base').warn
, error = require('okdoki/lib/base').error
, http  = require('https')
, url   = require('url')
;


// ****************************************************************
// ****************** Helpers *************************************
// ****************************************************************

// ****************************************************************
// ****************** Mail_Room ***********************************
// ** To be used only in this file.********************************
// ****************************************************************

function Mail_Room() {
  var im_count      = 0;
  var ims           = {};
  var wait_for_more = true;
  var is_fin        = false;
}

Mail_Room.new = function () {
  return (new Mail_Room());
};

Mail_Room.prototype.stop_and_send = function (err, reply) {
  if (err) {
    error(err, reply);
  }

  if (err || !reply) {
    me.send_to_server();
    return true;
  }

  return false;
};

Mail_Room.prototype.read_im = function () {
  if (is_fin) {
    warn("Can not call :send_to_server after instance if finished.");
    return;
  }

  var me = this;
  CB.client.lpop('send-to-bots', function (err, reply) {
    return me.received_im_id(err, reply);
  });
};

Mail_Room.prototype.received_im_id = function (err, id) {
  var me = this;

  if (me.stop_and_send(err, id))
    return false;

  CB.client.hgetall(id, function (err, reply) {
    me.received_im(err, reply, id);
  });
};

Mail_Room.prototype.received_im = function (err, reply, id) {

  var me = this;

  if (me.stop_and_send(err, reply))
    return false;

  if (!me.ims[reply.to])
    me.ims[reply.to] = [];

  reply.id = id;
  me.ims[reply.to].push(reply);
  me.im_count += 1;
  return me.read_im();
};

Mail_Room.prototype.send_to_server = function () {
  var me = this;
  if (me.im_count === 0)
    return null;

  _.each(me.ims, function (ims, name) {
    var cb = CB.new(name);
    cb.send_ims(ims);
  });

  me.im_count = 0;
  me.ims = {};
};

// ****************************************************************
// ****************** Main Stuff **********************************
// ****************************************************************

// ****************************************************************
// ****************** Chat "Class" ********************************
// ****************************************************************

exports.Chat_Bot = CB = function (client) {
  if(client)
    this.client = client;
};

CB.send_ims = function () {
  var mr = Mail_Room.new();
  mr.read_im();
};

// ****************************************************************
// ****************** Chat "Class" ********************************
// ****************************************************************

CB.new = function (name) {
  var cb = new CB();
  cb.screen_name = name;
  cb.received_ims = [];
  return cb;
};

CB.prototype.ims_success = function (arr_ims) {
  _.each(arr_ims, function (v) {
    CB.client.del(v.id);
  });
};

CB.prototype.ims_fail = function (arr_ims) {
  var msgs = {}
  _.each(arr_ims, function (v, i) {
    if (msgs[v.from])
      msgs[v.from] = []
    msgs[v.from].push(v);
  });
  _.each(msgs, function (ims, name) {
    Screen_Name.new(name).create_sys_im({msg: "Try again later.", msgs: msgs, category: "could not send"});
  });
};

CB.prototype.send_ims = function (arr_ims) {
  var me = this;
  me.read_info(function (meta) {

    if(!meta) {
      me.ims_fail(arr_ims);
    }

    var msg = { msgs: arr_ims, token: meta.token, action: "new msgs from humans" };
    var url = url.parse(meta.url);
    var req = http.request({host: url.host, path: url.pathname}, function (res) {

      if (res.statusCode !== 200) {
        me.ims_fail(arr_ims);
        return false;
      }

      var data = "";

      res.on('data', function (d) {
        data += d;
      });

      res.on('end', function () {
        me.ims_success(arr_ims, data);
      });

      return true;
    })

    req.on('error', function (e) {
      error(e);
      me.ims_fail(arr_ims);
    });

    req.end();
  });
};

CB.prototype.read_info = function (on_fin) {
  throw new Error('not done');
  // Get info on bot:
  CB.client.hgetall(me.screen_name, function (err, meta) {
    if (err)
      error(err);
    if (!err && meta) {
      on_fin(meta);
    }

    var sql = "\
      SELECT bots.*  \
      FROM   bots INNER JOIN screen_names    \
        ON (bots.owner_id = screen_names.id  \
             AND screen_names.trashed_at IS NULL) \
      WHERE  screen_names.screen_name = $1 \
        AND url IS NOT NULL; \
      LIMIT 1; \
    ";
    var db = new pg.query(sql, [me.screen_name]);
    db.run_and_then(function (err, meta) {
      if (err) {
        error(err);
        return on_fin(null);
      }
      on_fin(meta);
    });
  });
};



// USER { okid: ..., is_bot: TRUE,  }
// send-to-bots [ NAME:ost NAME:ost ... ]
// [main]@MY_NAME : { owner_id: ..., url: ... }
// NAME:0232332ost : { k:v ... from: okid}
//
//
//
//
//
