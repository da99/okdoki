var Refresh = 4; // seconds
var S;
var _ = require('underscore');
var Redis = require('okdoki/lib/Redis').Redis;
var IM = require('okdoki/lib/IM').IM;


// ****************************************************************
// ****************** Helpers *************************************
// ****************************************************************

// OST = 0; // parseInt((new Date(2013, 0, 31)).getTime());

function since() {
  return (new Date).getTime();
}

function log() {
  var args = _.map(_.toArray(arguments), function (v, i) {
    if (!_.isArray(v))
      return v;
    var arr = v;
    return ((_.isArray(arr) && arr.length > 5) ? 'Array: ' + arr.length : arr);;
  });

  console['log'].apply(console, args);
}

// ****************************************************************
// ****************** Main Stuff **********************************
// ****************************************************************

exports.Screen_Name = S = function () {
};

S.expire_in = 4; // Refresh rate.

S.new = function (n) {
  var s         =  new S();
  s.data        = {};
  s.screen_name = n;
  return s;
};

S.prototype.heart_beep = function (on_fin) {
  var me = this;
  var n  = me.screen_name;

  var client = Redis.client.multi();

  client.hmset(n, {s: since()});
  client.expire(n, S.expire_in + 7); // online status
  client.expire(n + ':c',    secs + 7); // list of contacts
  client.expire(n + ':ims',  secs + 7); // list of ims by customer
  client.expire(n + ':dims', secs + 7); // list of direct ims to customer
  client.exec(on_fin);
};

//  Customer wants to send a direct im to someone.
S.prototype.create_dim = function (o, on_fin) {
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
    if (e) error(e);
    m['id'] = m_id;
    on_fin(r, m);
  });
};

S.prototype.create_im = function (o, on_fin) {
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
    if(e) error(e);
    m['id'] = m_id;
    on_fin(r, m);
  });
};

S.prototype.read_ims_and_dims = function (on_fin) {
  var me = this;

  me.read_ims(function (ims) {
    me.read_dims(function (dims) {
      var ims_dims = ims.concat(dims).sort(function (a,b) {
        return (a.created_at || 0) - (b.created_at || 0);
      });

      on_fin(ims_dims);
    });
  });
};

S.prototype.read_dims = function (on_fin) {
  var me = this;
  var n = me.screen_name;
  var new_message = [];

  Redis.pop_records_from_list(n + ':dims', on_fin);
};

S.prototype.read_ims = function (on_fin) {
  var me           = this;
  var n            = me.screen_name;
  var new_messages = [];

  Redis.client.hkeys(n + ':c', function (err, contacts) {

    if (err) {
      error(err);
      on_fin(contacts || []);
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

S.prototype.delete_expired_ims = function (on_fin) {
  // Get old messages,
  // find old ones,
  // record ids, then delete ids in -->
  //    "NAME:ims" : { id1: 1, id2: 1, ... }
  Redis.client.hkeys(msgs_id, function (err, replys) {
    if (err || replys.length === 0)
      on_fin(err, replys)

    var jobs       = Jobs.new();
    var delete_ids = [];

    _.each(replys, function (m_id, i) {
      jobs.create('created_at for:', m_id, function (f) {
        Redis.client.hget(m_id, "created_at", function (err, ost) {
          if (!err && !ost)
            delete_ids.push(m_id);
          f(err, ost);
        });
      });
    });

    jobs.run(function () {
      if (delete_ids.length === 0)
        return on_fin(err, replys);

      // As of node-redis 0.8.2: hmdel
      //   can only handle the following
      //   arguments:
      //   .hdel( key, x, x, .. f);
      //   .hdel( [key,x,x,..', f);
      // The second one is used.
      //  [x,x,x,x] -> x,x,x,x
      delete_ids.unshift(msgs_id);
      Redis.client.hdel(delete_ids, on_fin);
    });
  });

}; // end: func delete_expired_ims


