var _ = require('underscore');


var IM = exports.IM = function (data) {
}

IM.keys = "body to from labels cid okid ref_cid ref_okid".split(" ");

IM.new = function (data) {
  var im = new IM();
  im.data = ({});

  im.from(data.from || "");
  im.to(data.to || "");
  im.labels( data.labels || "");
  im.body( data.body || "");
  im.body( data.cid || "");

  return im;
};

IM.uniq_str = function(str) {
  return _.uniq( _.map( str.split(" "), function(v){
    return v.trim();
  })).join(' ').trim();
}

IM.prototype.body = function (v) {
  var me = this;
  if (arguments.length === 0)
    return me.data.body;

  me.data.body = (v || "").trim();

  return me.data.body;
};

_.each(IM.keys, function (v) {
  IM.prototype[v] = new Function(
  " var me = this; " +
  " var this_name = '" + v + "'; \n" +
  " if (arguments.length === 0) " +
  "   return me.data." + v + "; \n" +
  " me.data." + v + " = me.constructor.uniq_str((me.data." + v + ' || "") + " " + (arguments[0] || "")); ' +
  " return me; "
  );
});

//  Customer wants to send a direct im to someone.
IM.prototype.create_dim = function (o, on_fin) {
  var me      = this;
  var raw     = o;
  var o_name  = me.screen_name;
  var m_id    = o_name + ':' + since();
  var client  = Redis.client.multi();


  // Save msg.
  var m  = {};

  _.each(IM.keys, function (k) {
    if (raw.hasOwnProperty(k)) {
      if(_.isFunction(raw[k]))
        m[k] = raw[k]();
      else
        m[k] = raw[k];
    }
  });

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

IM.prototype.create_im = function (o, on_fin) {
  var me      = this;
  var raw     = o;
  var o_name  = me.screen_name;
  var m_id    = o_name + ':' + since();
  var msgs_id = o_name + ':ims';
  var client  = Redis.client.multi();


  // Save msg.
  var m  = {};

  _.each(IM.keys, function (k) {
    if (raw.hasOwnProperty(k)) {
      if(_.isFunction(raw[k]))
        m[k] = raw[k]();
      else
        m[k] = raw[k];
    }
  });

  m['from']   = o_name;

  // Create msg record w/ expire.
  client.hmset(m_id, m);
  client.expire(m_id, S.expire_in + 4);

  // Add msg to owner list + update expire.
  client.hset(msgs_id, m_id, 1);
  client.expire(msgs_id, S.expire_in + 6);

  // Execute:
  client.exec(function (e, r) {
    m['id'] = m_id;
    on_fin(e, r, m);
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






