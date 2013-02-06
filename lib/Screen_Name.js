var Refresh = 4; // seconds
var S, OST;
var _ = require('underscore');
var Redis = require('okdoki/lib/Redis').Redis.client;
var IM = require('okdoki/lib/IM').IM;


// ****************************************************************
// ****************** Helpers *************************************
// ****************************************************************

OST = parseInt((new Date(2013, 0, 31)).getTime());

function since_OST() {
  return ((new Date).getTime() - OST);
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

  var client = Redis.multi();

  client.hmset(n, {s: since_OST()});
  client.expire(n, S.expire_in + 7); // online status
  client.expire(n + ':c',    secs + 7); // list of contacts
  client.expire(n + ':ims',  secs + 7); // list of ims by customer
  client.expire(n + ':dims', secs + 7); // list of direct ims to customer
  client.exec(on_fin);
};

//  Customer wants to send a direct im to someone.
S.prototype.create_dim = function (o, on_fin) {
  var me = this;
};

S.prototype.create_im = function (o, on_fin) {
  var me      = this;
  var raw     = o;
  var since   = since_OST();
  var o_name  = me.screen_name;
  var m_id    = o_name + ':' + since;
  var msgs_id = o_name + ':ims';
  var client  = Redis.multi();


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

  m['at_OST'] = since;
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

S.prototype.read_dims = function (on_fin) {
  var me = this;
  var n = me.screen_name;
  var new_message = [];

  // GET ids
  Redis.llen(n + ':dims', function (err, l){
    if (err) {
      error(err);
    }

    if (err || !l || l < 1)
      return on_fin([]);

    var multi = Redis.multi();
    while (l > 0) {
      multi.lpop(n + ':dims');
      l -= 1;
    }
    multi.exec(function (err, results) {
      if (err) {
        error(err)
      };
      var dim_ids = _.compact(_.flatten(results || []));
      if (dim_ids.length === 0) {
        return on_fin([]);
      }

      var get_dims = Redis.multi();
      _.each(dim_ids, function (id) {
        get_dims.hgetall(id);
      });
      get_dims.exec(function (err, raw_dims) {

        if (err) error(err);

        var dims = _.compact(_.map((raw_dims || []), function (d, i) {
          if !d
            return d;
          d.created_at = parseInt(dim_ids[i].split(':').pop());
          return d;
        }));

        return on_fin(dims);
      });
    });
  });
  // Get ims
  // Set created_at
};
S.prototype.read_ims = function (on_fin) {
  var me           = this;
  var n            = me.screen_name;
  var new_messages = [];

  Redis.hkeys(n + ':c', function (err, contacts) {

    if (err) {
      error(err);
      on_fin(contacts || []);
      return;
    }

    if (!contacts)
      contacts = [];
    contacts.push('[OKDOKI]');

    // Grab ids of messages from
    var multi = Redis.multi();
    _.each(contacts, function (name, i) {
      multi.hkeys(name + ':ims')
    });

    multi.exec(function (err, raw_ids) {

      var ids = _.flatten(raw_ids, 1);
      if (err)
        error(err);
      if (err || !ids || ids.length === 0)
        return on_fin([]);

      var multi = Redis.multi();
      _.each(ids, function (v, i) {
        multi.hgetall(v);
      });

      multi.exec(function (err, msgs) {
        if (err)
          error(err);
        if (err || !msgs || msgs.length === 0)
          return on_fin([]);

        _.each(msgs, function (m, i) {
          if (!m) return; // the message expired while during query.
          m['for'] = n;
          m['created_at'] = parseInt(ids[i].split(':').pop());
          new_messages.push( m );
        });

        me.read_dims(function (dims) {
          on_fin(new_messages.concat(dims).sort(function (a,b) {
            return (a.created_at || 0) - (b.created_at || 0);
          }));
        });
      });
    });
  });
};

S.prototype.delete_expired_ims = function (on_fin) {
  // Get old messages,
  // find old ones,
  // record ids, then delete ids in -->
  //    "NAME:ims" : { id1: 1, id2: 1, ... }
  Redis.hkeys(msgs_id, function (err, replys) {
    if (err || replys.length === 0)
      on_fin(err, replys)

    var jobs       = Jobs.new();
    var delete_ids = [];

    _.each(replys, function (m_id, i) {
      jobs.create('at_OST for:', m_id, function (f) {
        Redis.hget(m_id, "at_OST", function (err, ost) {
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
      Redis.hdel(delete_ids, on_fin);
    });
  });

}; // end: func delete_expired_ims


