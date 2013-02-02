var Refresh = 4; // seconds
var S, OST;

// ****************************************************************
// ****************** Helpers *************************************
// ****************************************************************

OST = parseInt((new Date(2013, 0, 31)).getTime());

function since_OST() {
  return ((new Date).getTime() - OST);
}

function fin_func(e, f) {
  return function (err, reply) {
    if (err) {
      if (e)
        return e(err, reply);
      else
        throw err;
    }

    if (r)
      f(reply);
  };
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

exports.Screen_name = S = function (n) {
  if (n.match && n.trim)
    this.screen_name = n;
  else
    S.client = n;
};

S.new = function (n, opts) {
  var s =  new S();
  s.data = {};
  s.data.val = n;
  if (!opts)
    return s;

  _.each(opts, function (v, k) {
    switch (k) {
      case 'on_err':
        s.data.on_err = v;
        break;
      default:
        throw new Error('Unknown option: ' + k);
    };
  });

  return s;
};

S.prototype.refresh = function (on_fin) {
  var me = this;

  var client = S.client.multi();

  client.hmset(n, {s: since});
  client.expire(n, secs + 7);        // online status
  client.expire(n + ':c', secs + 7); // list of contacts
  client.exec(fin_func(on_fin, on_err));
};

S.prototype.create_im = function (o, on_fin) {
  // ELSE: (delete old messages and save new one.)
  var raw     = req.body.message;
  var since   = since_OST();
  var o_name  = raw.owner_screen_name;
  var m_id    = o_name + ':' + since;
  var msgs_id = o_name + ':msgs';
  var client  = R.multi();


  // Save msg.
  m  = {
    body   : raw.message_body,
    at_OST : since.toString(),
    owner  : o_name
  }
  obj.message = m;

  // Create msg record w/ expire.
  client.hmset(m_id, m);
  client.expire(m_id, secs + 4);

  // Add msg to owner list + update expire.
  client.hset(msgs_id, m_id, 1);
  client.expire(msgs_id, secs + 6);

  // Execute:
  client.exec(fin);
};

S.prototype.read_ims = function (on_fin) {
    // Grab messages:
    cmd_q.push("get contacts for: " + n);
    R.hkeys(n + ':c', function (err, contacts) {

      if (err || !contacts || contacts.length === 0) {
        fin(err, contacts);
        return;
      }

      // Grab ids of messages from
      var multi = R.multi();
      _.each(contacts, function (name, i) {
        multi.hkeys(name + ':msgs')
      });

      multi.exec(function (err, raw_ids) {
        var ids = _.flatten(raw_ids, 1);
        if (err || !ids || ids.length === 0) {
          return fin(err, ids);
        }

        var multi = R.multi();
        _.each(ids, function (v, i) {
          multi.hgetall(v);
        });
        multi.exec(function (err, msgs) {
          if (err || !msgs || msgs.length === 0) {
            return fin(err, ids);
          }
          _.each(msgs, function (m, i) {
            if (!m)
              return; // the message expired while during query.
            m['for'] = n;
            new_messages.push( m );
          });

          fin(err, ids);
        });
      });

    });
};

S.prototype.delete_expired_ims = function (on_fin) {
  // Get old messages,
  // find old ones,
  // record ids, then delete ids in -->
  //    "NAME:msgs" : { id1: 1, id2: 1, ... }
  var delety    = R.multi();
  var del_q_msg = false;
  var del_q     = null;
  R.hkeys(msgs_id, function (err, replys) {
    if (err || replys.length === 0)
      fin(err, replys)

    del_q = replys.length;

    _.each( replys, function (m_id, i) {
      R.hget(m_id, "at_OST", function (err, ost) {

        del_q -= 1;

        if (err) {
          log(err, ' MSG ID: ', m_id);
          ost = "don't erase: " + m_id;
        }

        if (!ost) {
          if (!del_q_msg) {
            del_q_msg = {ids : [], msg: "Delete old msgs in list:" };
          }
          del_q_msg.msg += (' ' + m_id);
          del_q_msg.ids.push(m_id);
        }

        if (del_q < 1) {
          if (del_q_msg && del_q_msg.ids.length > 0) {
            // As of node-redis 0.8.2: hmdel can not handle
            //   arrays of length of 2 or more.
            // So we have to squash it into arguments:
            //  [x,x,x,x] -> x,x,x,x
            var args = del_q_msg.ids;
            args.unshift(msgs_id);
            args.push(fin);
            R.hdel.apply(R, args);
          } else
            fin(null, replys);
        }

      });
    });
  });

}


