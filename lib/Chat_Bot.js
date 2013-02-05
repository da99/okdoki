
var CB         = null
, _            = require('underscore')
, log          = require('okdoki/lib/base').log
, warn         = require('okdoki/lib/base').warn
, error        = require('okdoki/lib/base').error
, http         = require('https')
, url          = require('url')
, Customer     = require('okdoki/lib/Customer').Customer
, Screen_Name  = require('okdoki/lib/Screen_Name').Screen_Name
, pg           = require('okdoki/lib/POSTGRESQL')
, Redis_Client = require('okdoki/lib/Redis').Redis.client
;


// ****************************************************************
// ****************** Helpers *************************************
// ****************************************************************

// ****************************************************************
// ****************** Mail_Room ***********************************
// ** To be used only in this file.********************************
// ****************************************************************

function Mail_Room() {
}

Mail_Room.new = function (return_url, on_fin_func) {
  if (!return_url)
    throw new Error('Return url is required.');

  var mr = (new Mail_Room());
  mr.im_count      = 0;
  mr.ims           = {};
  mr.wait_for_more = true;
  mr.on_fin_func   = on_fin_func;
  mr.is_fin        = false;
  mr.on_fin_count  = 0;

  mr.on_fin = function () {
    me.on_fin_count =- 1;
    if (me.on_fin_count === 0) {
      if (me.is_fin) {
        throw new Error("on_fin_func called more than once.");
      } else
        me.is_fin = true;
      me.on_fin_func();
    }
  };


  return mr;
};

Mail_Room.prototype.stop_and_send = function (err, reply) {
  var me = this;
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
  var me = this;

  if (me.is_fin) {
    throw new Error("Can not call :send_to_server after instance if finished.");
  }

  Redis_Client.lpop('send-to-bots', function (err, reply) {
    return me.received_im_id(err, reply);
  });
};

Mail_Room.prototype.received_im_id = function (err, id) {
  var me = this;

  if (me.stop_and_send(err, id))
    return false;

  Redis_Client.hgetall(id, function (err, reply) {
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
    return me.on_fin();

  _.each(me.ims, function (ims, name) {
    me.on_fin_count += 1;
    var cb = CB.new(name);
    cb.send_ims(ims, function () {
      me.finish_count -= 1;
      me.on_fin();
    });
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

exports.Chat_Bot = CB = function () {
};

CB.redis = Redis_Client;
CB.send_ims = function (return_url, on_fin) {
  var mr = Mail_Room.new(return_url, on_fin);
  mr.read_im();
};

// ****************************************************************
// ****************** Chat "Class" ********************************
// ****************************************************************

CB.new = function (name) {
  var cb = new CB();
  cb.data = {};
  cb.screen_name = name;
  cb.name = name.split('@')[0];
  cb.owner_screen_name = name.split('@')[1];
  cb.received_ims = [];
  return cb;
};

// ****************************************************************
// ****************** Chat "Instances" ****************************
// ****************************************************************

CB.prototype.create = function (new_vals, on_fin) {
  var me = this;
  Customer.read_by_screen_name(me.owner_screen_name, function (c) {
    var db = new pg.query();
    var sql = " \
      INSERT INTO bots (id, owner_id, name, display_name, nick_name, url) \
      VALUES ( $1, $2, UPPER($3), $3, $3, $4 ) \
      RETURNING * ; \
    ";
    db.q(sql, [pg.generate_id(""), c.screen_name_id(me.owner_screen_name), me.name, new_vals.url]);
    db.run_and_then(function (meta) {
      var data = meta.rows[0];
      me.data = data;
      me.screen_name = data.name + '@' + me.owner_screen_name;
      on_fin(me);
    });
  });
};

CB.prototype.ims_success = function (arr_ims) {
  var me = this;

  _.each(arr_ims, function (v) {
    Redis_Client.del(v.id, function (err, reply) {
      if (err)
        error(err);
      me.on_fin();
    });
  });
};

CB.prototype.ims_fail = function (arr_ims) {
  var me    = this;
  var msgs  = {};

  _.each(arr_ims, function (v, i) {
    if (!msgs[v.from])
      msgs[v.from] = []
    msgs[v.from].push(v);
  });

  _.each(msgs, function (ims, name) {
    _.each(ims, function (im, i) {
      var vals = {msg: "Message could not reach destination. Try again later.", ref_msg: im};
      Screen_Name.new(name).create_sys_im(vals, function () {
        me.on_fin();
      });
    });
  });
};

CB.prototype.send_ims = function (arr_ims, on_fin) {

  var me = this;
  me.on_fin = on_fin;
  me.read_info(function (meta) {

    if(!meta || !meta.rows[0]) {
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
  var me = this;

  // Get info on bot:
  Redis_Client.hgetall(me.screen_name, function (err, meta) {
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
        AND url IS NOT NULL \
      LIMIT 1; \
    ";
    var db = new pg.query(sql, [me.screen_name]);
    db.run_and_then(function (meta) {
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
