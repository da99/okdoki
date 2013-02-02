var Refresh = 4; // seconds
var S, OST;

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

exports.Redis_Screen_name = S = function (client) {
  if (client)
    S.client = client;
};

S.expire_in = 4; // Refresh rate.

S.new = function (n) {
  var s =  new S();
  s.data = {};
  s.data.val = n;
  s.screen_name = n;
  return s;
};

S.prototype.refresh = function (on_fin) {
  var me = this;
  var n  = me.screen_name;

  var client = S.client.multi();

  client.hmset(n, {s: since_OST()});
  client.expire(n, S.expire_in + 7);        // online status
  client.expire(n + ':c', secs + 7); // list of contacts
  client.exec(on_fin);
};

S.prototype.create_im = function (o, on_fin) {
  var me      = this;
  var raw     = o;
  var since   = since_OST();
  var o_name  = me.screen_name;
  var m_id    = o_name + ':' + since;
  var msgs_id = o_name + ':msgs';
  var client  = S.client.multi();


  // Save msg.
  var m  = {
    body   : raw.body,
    at_OST : since,
    owner  : o_name
  }

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

S.prototype.read_ims = function (on_fin) {
  var me           = this;
  var n            = me.screen_name;
  var new_messages = [];

  S.client.hkeys(n + ':c', function (err, contacts) {

    if (err || !contacts || contacts.length === 0) {
      on_fin(err, contacts);
      return;
    }

    // Grab ids of messages from
    var multi = R.multi();
    _.each(contacts, function (name, i) {
      multi.hkeys(name + ':msgs')
    });

    multi.exec(function (err, raw_ids) {
      var ids = _.flatten(raw_ids, 1);
      if (err || !ids || ids.length === 0)
        return on_fin(err, raw_ids);

      var multi = R.multi();
      _.each(ids, function (v, i) {
        multi.hgetall(v);
      });

      multi.exec(function (err, msgs) {
        if (err || !msgs || msgs.length === 0)
          return on_fin(err, msgs);

        _.each(msgs, function (m, i) {
          if (!m) return; // the message expired while during query.
          m['for'] = n;
          new_messages.push( m );
        });

        on_fin(err, new_messages);
      });
    });
  });
};

S.prototype.delete_expired_ims = function (on_fin) {
  // Get old messages,
  // find old ones,
  // record ids, then delete ids in -->
  //    "NAME:msgs" : { id1: 1, id2: 1, ... }
  S.client.hkeys(msgs_id, function (err, replys) {
    if (err || replys.length === 0)
      on_fin(err, replys)

    var jobs       = Jobs.new();
    var delete_ids = [];

    _.each(replys, function (m_id, i) {
      jobs.create('at_OST for:', m_id, function (f) {
        S.client.hget(m_id, "at_OST", function (err, ost) {
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
      S.client.hdel(delete_ids, on_fin);
    });
  });

}; // end: func delete_expired_ims


