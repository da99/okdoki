
class Screen_Name

S.read_by_id = function (id, flow) {
  River.new(flow)
  .job('read screen name id:', id, function (j) {
    Topogo.new(TABLE_NAME).read_by_id(id, j);
  })
  .job(function (j, r) {
    return j.finish(S.new(r));
  })
  .run();
};

EVE.on('read life by screen name', function (flow) {
  var sn = flow.data.screen_name;
  EVE.run(flow, function (j) {
    Topogo.new(TABLE_NAME)
    .read_one({screen_name: sn.toUpperCase()}, j);
  }, function (j) {
    j.finish(S.new(j.last));
  });
});


S.find_screen_name_keys = function (arr) {
  var key = _.detect([ 'screen_name_id', 'publisher_id', 'owner_id', 'author_id', 'follower_id'], function (k) {
    return (arr[0] || '').hasOwnProperty(k);
  }) || 'screen_name_id';

  var new_key = key.replace('_id', '_screen_name');
  return [key, new_key];
};


S.attach_screen_names = function (arr, flow) {
  var keys = S.find_screen_name_keys(arr);
  var key = keys[0];
  var new_key = keys[1];

  var vals = _.pluck(arr, key);
  if (!vals.length)
    return flow.finish([]);

  River.new(flow)
  .job(function (j) {
    TABLE.read_list({id: vals}, j);
  })
  .job(function (j, names) {
    var map = {};
    _.each(names, function (n) {
      map[n.id] = n.screen_name;
    });

    _.each(arr, function (r, i) {
      arr[i][new_key] = map[arr[i][key]];
    });

    j.finish(arr);
  })
  .run();
};

S.replace_screen_names = function (arr, flow) {
  var keys = S.find_screen_name_keys(arr);
  var key = keys[0];
  var new_key = keys[1];

  River.new(flow)
  .job(function (j) {
    S.attach_screen_names(arr, j);
  })
  .job(function (j, new_arr) {
    _.each(new_arr, function (r, i) {
      new_arr[i][key] = undefined;
    });

    j.finish(new_arr);
  })
  .run();
};

S.read_list = function (c, flow) {
  River.new()
  .job('read screen names', c.data.id, function (j) {
    Topogo.new(TABLE_NAME)
    .read_list({owner_id: j.id}, j);
  })
  .job('push', 'screen_names', function (j, r) {
    _.each(r, function (row) {
      c.push_screen_name_row(row);
    });
    return j.finish(c);
  })
  .job(function (j, last) {
    flow.finish(last);
  })
  .run();
};



S.prototype.read_screen_names = function (flow) {
  var me = this;

  River.new(arguments)

  .job('read screen names for:', me.data.id, function (j) {
    Topogo.new(TABLE_NAME).read_list({owner_id: j.id}, j);
  })

  .job(function (j, names) {
    if (!names.length)
      return flow.finish('not_valid', new Error('No screen names found for customer id: ' + me.data.id));

    me.data.screen_name_rows = null;

    _.each(names, function (v, k) {
      me.push_screen_name_row(v);
    });

    return j.finish(me);
  })

  .run();

};










end # === class Screen_Name read ===





