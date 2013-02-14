var _ = require('underscore')
, Redis = require('okdoki/lib/Redis').Redis
;

var IM = exports.IM = function (data) {
}

IM.expire_in = 4; // default

IM.keys = "to from body labels cid okid ref_cid ref_okid".split(" ");

IM.new = function (data) {
  var im = new IM();
  im.data = ({});

  _.each(data, function (v, k) {
    if (_.contains(IM.keys, k)) {

      if (_.isFunction(v))
        v = v(im);

      if (im[k]) {
        im[k](v);
      } else {
        im.data[k] = v;
      }

    }
  });

  return im;
};

IM.pattern_whitespace = /\s+/ig;

IM.uniq_str = function() {
  var args    = _.toArray(arguments);
  var str     = _.compact(args).join(" ");
  var labels  = str.split(IM.pattern_whitespace);
  var trimmed = _.map(labels, function(v){
    return v.trim();
  });
  var labels_str = _.uniq(trimmed).join(' ').trim();

  return labels_str;
}

_.each(IM.keys, function (v) {
  IM.prototype[v] = function () {
    var me = this;
    var this_name = v;
    if (arguments.length === 0)
      return me.data[v];
    me.data[v] = arguments[0];
    return me;
  }
});

IM.prototype.body = function (v) {
  var me = this;
  if (arguments.length === 0)
    return me.data.body;

  me.data.body = (v || "").trim();

  return me.data.body;
};

_.each(['labels', 'to'], function(name){
  IM.prototype[name] = function () {
    var me = this;
    var k = name;
    if (arguments.length === 0)
      return me.data[k];
    me.data[k] = IM.uniq_str(me.data[k], arguments[0]);
    return me;
  }
});

//  Customer wants to send a direct im to someone.
IM.prototype.create_dim = function (o, on_fin) {
  var me      = this;
  var raw     = o;
  var o_name  = me.screen_name;
  var m_id    = o_name + ':' + (new Date).getTime();
  var client  = Redis.client.multi();


  // Save msg.
  var m  = IM.new(o);

  m['from']   = o_name;

  if (m['from'] !== '[OKDOKI]')
    throw new Error('Not ready to handle dims from actual users because' +
                    ' you need to verify the two customers know each other.');

  // Create msg record w/ expire.
  client.hmset(m_id, m);
  client.expire(m_id, S.expire_in + 6);

  // Add msg to owner list + update expire.
  client.rpush(m['to'] + ':dims', m_id);
  client.expire(m['to'] + ':dims', S.expire_in + 6);

  // Execute:
  client.exec(function (e, r) {
    m['id'] = m_id;
    on_fin(e, r, m);
  });
};

IM.create = function (o, job_or_on_fin) {
  if (job_or_on_fin.error) {
    var on_fin = null;
    var job    = job_or_on_fin;
  } else {
    var on_fin = job_or_on_fin;
    var job = null;
  }

  var me     = this;
  var im_id  = o.from + ':' + (new Date).getTime();
  var ims_id = o.from + ':ims';
  var client = Redis.client.multi();
  var expire_in = (o.expire_in || IM.expire_in);

  // Save msg.
  var im  = IM.new(o);

  // Create msg record w/ expire.
  client.hmset(  im_id, im.data);
  client.expire( im_id, expire_in + 4 );

  // Add msg to owner list + update expire.
  client.hset(   ims_id, im_id, 1);
  client.expire( ims_id, expire_in + 6);

  // Execute:
  client.exec(function (e, r) {
    if (e) {
      if (job)
        return job.error(e, r, im);
      else
        throw e;
    }

    im.io_replys = r;
    im['id'] = im_id;
    if (job)
      job.finish(im);
    else
      on_fin(im);
  });
};

IM.prototype.read_ims_and_dims = function (on_fin) {
  var me = this;

  me.read_ims(function (ims) {
    me.read_dims(function (dims) {
      var ims_dims = ims.concat(dims).sort(function (a,b) {
        return (a.created_at || 0) - (b.created_at || 0);
      });

      on_fin(null, ims_dims);
    });
  });
};

IM.prototype.read_dims = function (on_fin) {
  var me = this;
  var n = me.screen_name;
  var new_message = [];

  Redis.pop_records_from_list(n + ':dims', on_fin);
};

IM.prototype.read_ims = function (on_fin) {
  var me           = this;
  var n            = me.screen_name;
  var new_messages = [];

  Redis.client.hkeys(n + ':c', function (err, contacts) {

    if (err) {
      on_fin(err, contacts);
      return;
    }

    if (!contacts)
      contacts = [];
    contacts.push('[OKDOKI]');

    // Grab ids of messages from
    var multi = Redis.client.multi();
    _.each(contacts, function (name, i) {
      multi.hkeys(name + ':ims')
    });

    multi.exec(function (err, raw_ids) {
      Redis.read_records_from_ids(_.flatten((raw_ids || []), 1), function (ims) {
        on_fin(ims);
      });

    });
  });
};






