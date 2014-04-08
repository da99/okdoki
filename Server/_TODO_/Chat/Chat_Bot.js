
var _          = require('underscore')
, https        = require('https')
, url          = require('url')
, request      = require('request')
, River        = require('da_river').River
, Topogo       = require('topogo').Topogo
, log          = require('../App/base').log
, warn         = require('../App/base').warn
, error        = require('../App/base').error
, UID          = require('../App/UID').UID
, Customer     = require('../Customer/model').Customer
, Screen_Name  = require('../Screen_Name/model').Screen_Name
, IM           = require('../IM/model').IM
, MAX_IM_BATCH_COUNT = 250
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

Mail_Room.new = function (return_url, river) {

  if (!return_url)
    return river.error(new Error('Return url is required.'));

  var mr = (new Mail_Room());
  mr.im_count        = 0;
  mr.ims             = [];
  mr.is_fin          = false;
  mr.first_run       = true;
  mr.should_cont_pop = true;
  mr.river           = river;

  mr.on_fin = function (err, reply) {
    if (err)
      return river.error(err, reply);

    if (mr.is_fin)
      return river.error(new Error("on_fin called more than once."), mr);

    mr.is_fin = true;
    river.finish();
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
  if (me.im_count < 1) {
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
    return me.river.error(new Error("Can not call :send_to_server after instance if finished."));
  }

  me.wait_for_im();

  Redis_Client.lpop('send-to-bots', function (err, id) {

    if (err)
      return me.river.error(err, id);

    if (!id) {
      me.cont_pop(false);
      me.finished_im();
      return;
    }

    Redis_Client.hgetall(id, function (err, reply) {
      if (err)
        return me.river.error(err, reply);

      if (!reply) {
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

var CB = exports.Chat_Bot = function () {};

// ****************************************************************
// ****************** Helpers *************************************
// ****************************************************************

CB.deliver_ims = function (return_url, river) {
  var mr = Mail_Room.new(return_url, river);
  mr.deliver();
};

CB.new = function (o) {
  var cb          = new CB();
  cb.data         = o || {};
  cb.received_ims = [];
  return cb;
};

// ****************************************************************
// ****************** Chat "Instances" ****************************
// ****************************************************************

CB.create = function (new_vals, flow) {
  PG.new()
  .q(SQL
     .insert_into('bots')
     .values({
       id        : UID.generate_id(),
       owner_id  : new_vals.owner_id,
       name      : ['UPPER($1)', new_vals.name],
       nick_name : new_vals.nick_name || null,
       url       : new_vals.url
     })
    )
  .job(function (j) {
    return CB.new(row);
  })
  .run();
};

CB.send_im = function (cb, flow) {

  var me = cb;
  var im = IM.new(cb.new_data);
  me.read_info(function (err, meta) {

    if (err)
      return me.on_fin(err, meta);

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
    };

    var req = request.post(http_opts, function (err, res, data) {

      if (err)
        return me.on_fin(err, data);

      if (!res || res.statusCode !== 200) {
        me.im_fail(im);
        return false;
      }

      me.im_success(im, data);

      return true;
    })

  });
};

CB.prototype.im_success = function (im) {
  var arr_ims = [im];
  var me = this;

  _.each(arr_ims, function (v) {
    Redis_Client.del(v.id, function (err, reply) {
      if (err)
        return me.river.error(err, reply);
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
    if (err)
      return me.river.error(err, reply);
    me.on_fin(err, reply);
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
    db.run(function (meta) {
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
