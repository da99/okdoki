
var CB         = null
, _            = require('underscore')
, log          = require('okdoki/lib/base').log
, warn         = require('okdoki/lib/base').warn
, error        = require('okdoki/lib/base').error
, https        = require('https')
, url          = require('url')
, Customer     = require('okdoki/lib/Customer').Customer
, Screen_Name  = require('okdoki/lib/Screen_Name').Screen_Name
, pg           = require('okdoki/lib/POSTGRESQL')
, Redis_Client = require('okdoki/lib/Redis').Redis.client
, IM           = require('okdoki/lib/IM').IM
, MAX_IM_BATCH_COUNT = 250
, url = require('url')
, request = require('request')
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
  mr.ims           = [];
  mr.on_fin_func   = on_fin_func;
  mr.is_fin        = false;
  mr.should_cont_pop = true;
  mr.first_run     = true;

  mr.on_fin = function (err) {
    if (err)
      return mr.on_fin_fun(err, mr);

    if (mr.is_fin)
      return mr.on_fin_func(new Error("on_fin_func called more than once."), mr);

    mr.is_fin = true;
    mr.on_fin_func(null, mr);
  };

  return mr;
};

Mail_Room.prototype.wait_for_im = function () {
  var me = this;
  me.im_count += 1;
  return me.im_count;
};

Mail_Room.prototype.finished_im = function () {

  var me = this;
  me.im_count -= 1;
  if (me.im_count === 0) {
    return me.on_fin();
  }
};

Mail_Room.prototype.cont_pop = function () {
  var me = this;

  if (me.im_count < 0)
    warn("More messages are being processed than retrieved: " + me.im_count);

  if (me.im_count === 0 || (arguments.length > 0 && arguments[0] === false)) {
    me.should_cont_pop = false;
    return false;
  }

  return me.should_cont_pop;
}

Mail_Room.prototype.deliver = function () {
  var me = this;

  if(!me.first_run && !me.cont_pop()) {
    return;
  }

  me.first_run = false;

  if (me.is_fin) {
    return me.on_fin(new Error("Can not call :send_to_server after instance if finished."));
  }

  me.wait_for_im();

  Redis_Client.lpop('send-to-bots', function (err, id) {

    if (err)
      error(err);

    if (err || !id) {
      me.cont_pop(false);
      me.finished_im();
      return;
    }

    Redis_Client.hgetall(id, function (err, reply) {
      if (err)
        error(err);

      if (err || !reply) {
        me.cont_pop(false);
        me.finished_im();
        return;
      }

      me.received_im(reply, id);
    });
  });

  process.nextTick(function () {
      me.deliver();
  });

};

Mail_Room.prototype.received_im = function (reply, id) {
  var me = this;

  _.each( reply.to.split(' '), function (to) {
    var im = IM.new(reply);
    im.data.to = to;
    me.ims.push(im);
    CB.new(to).send_im(im, function () {
      me.finished_im();
    });

  });

  return me;
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
CB.deliver_ims = function (return_url, on_fin) {
  var mr = Mail_Room.new(return_url, on_fin);
  mr.deliver();
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
      on_fin(null, me);
    });
  });
};

CB.prototype.im_success = function (im) {
  var arr_ims = [im];
  var me = this;

  _.each(arr_ims, function (v) {
    Redis_Client.del(v.id, function (err, reply) {
      if (err)
        return me.on_fin(err, reply)
      me.on_fin(null, im);
    });
  });
};

CB.prototype.im_fail = function (im) {

  var me    = this;
  var msgs  = {};

  var vals = {
    labels   : 'system',
    body     : "Message could not reach destination. Try again later.",
    ref_cid  : im.cid(),
    ref_okid : im.okid(),
    from     : '[OKDOKI]',
    to       : im.from()
  };

  Screen_Name.new(vals.from).create_dim(vals, function (err, reply) {
    me.on_fin(err, reply);
  });

};

CB.prototype.send_im = function (im, on_fin) {

  var me = this;
  me.on_fin = on_fin;
  me.read_info(function (meta) {

    if(!meta) {
      me.im_fail(im);
      return;
    }

    var msg = {
      to     : im.data.to,
      from   : im.data.from,
      body   : im.data.body,
      token  : meta.token,
      labels : ["im"]
    };

    var http_data = JSON.stringify(msg);
    var http_opts = {
      url     : meta.url,
      data    : http_data,
      followAllRedirects : true,
      timeout : 3000,
      headers : {
        'accept' : 'application/json',
        'accept-charset' : 'utf-8',
        'content-type': 'application/json; charset=utf-8',
        'content-length': http_data.length
      }
    }
    var req = request.post(http_opts, function (err, res, data) {

      if (err)
        error(err);

      if (err || !res || res.statusCode !== 200) {
        me.im_fail(im);
        return false;
      }

      me.im_success(im, data);

      return true;
    })

  });
};

CB.prototype.read_info = function (on_fin) {
  var me = this;
  var name = me.screen_name.split('@')[0];
  var owner = me.screen_name.split('@')[1];

  // Get info on bot:
  Redis_Client.hgetall(me.screen_name, function (err, meta) {
    if (err)
      return on_fin(err, meta);

    if (!err && meta && !_.isEmpty(meta)) {
      return on_fin(null, meta);
    }

    var sql = "\
      SELECT bots.*  \
      FROM   bots INNER JOIN screen_names    \
        ON (bots.owner_id = screen_names.id  \
             AND screen_names.trashed_at IS NULL) \
      WHERE  screen_names.screen_name = UPPER($1) \
        AND bots.name = UPPER($2) \
        AND url IS NOT NULL \
      LIMIT 1; \
    ";
    var db = new pg.query(sql, [owner, name]);
    db.run_and_then(function (meta) {
      on_fin(null, meta.rows[0]);
    });
  });
};


// Message:
//   to:   okid
//   from: okid
//   body: string
//   labels: string
//
// USER { okid: ..., is_bot: TRUE,  }
// send-to-bots [ NAME:ost NAME:ost ... ]
// [main]@MY_NAME : { owner_id: ..., url: ... }
// NAME:0232332ost : { k:v ... from: okid}
//
//
//
//
//
