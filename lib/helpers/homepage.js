
var homepage = exports.homepage = {

  list : function homepage_list(o) {
    if (!o.no_rows)
      throw new Error('Msg for no_rows required: ' + o);
    if (!o.read)
      throw new Error('Method for reading required: ' + o);

    return function (req, resp, next) {
      var n = req.params.name;
      Customer.read_by_screen_name(n, function (owner) {
        var priv = homepage_priv(req.user, owner, owner.screen_name_row(n));
        if (!priv.allow)
          return write.json(resp, {success: false, msg: priv.msg});
        else {
          owner.read_posts(o.read, n, req.user, function (rows) {
            if (rows.length === 0)
              return write.json(resp, {success: true, msg: o.no_rows, rows: [] });
            else
              return write.json(resp, {success: true, msg: priv.msg, rows: rows });
          });
        }
      });
    }
  },

  priv: function homepage_priv(customer, owner, screen_name_row) {
    if (!customer)
      customer = {data : {id: null} };

    var r    = screen_name_row;
    var n    = r.screen_name;
    var meta = {};
    meta.homepage_belongs_to_viewer = customer.data.id === (owner.data.id);
    meta.is_trashed = r.trashed_at;

    if (meta.homepage_belongs_to_viewer) {
      meta.allow = true;
      meta.msg     = 'Homepage belongs to audience member.';
      return meta;
    }

    if (r.trashed_at) {
      meta.allow = false;
      meta.msg     = 'Screen name not found: ' + n;
      return meta;
    }


    if (r.read_able === 'W') {
      meta.allow = true;
      meta.msg     = 'Homepage is read-able by the World.';
      return meta;
    }

    meta.allow = false;
    meta.msg = 'Homepage is private: ' + n;
    return meta;

  }

};
