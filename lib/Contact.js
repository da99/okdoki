
  var client = redis_client;
  var o_into_contacts = [];
  var c_into_owner    = [];
  var o_menu          = {};
  var c_menu          = {};
  var menu_by_c       = null;
  var menu_by_o       = null;
  var contacts        = null;
  var contact_rids    = null;
  var online_contacts = null;

  var log_it = function (err, write) {
    if (err) {
      log(err);
      // return next(err);
    }
    if (write)
    return write_json_fail(resp, "Try next time..", 200, {menu: {}});
  }

  req.user.read_mutual_contacts(function (rows, menu_by_contact, menu_by_owner) {

    menu_by_c    = menu_by_contact;
    menu_by_o    = menu_by_owner;
    contacts     = _.keys(menu_by_contact);
    contact_rids = contacts;

    _.each(menu_by_owner, function (c_list, owner_name) {
      o_menu[owner_name] = {};
      c_menu[contact_name] = {};
      _.each(c_list, function (contact_name) {
        o_into_contacts.push( [owner_name, contact_name] );
        c_into_owner.push( [contact_name, owner_name] );

        o_menu[owner_name][contact_name] = 1;
        c_menu[contact_name][owner_name] = 1;
      });
    });

  });


  // See who is online.
  // Then, start inserting.
  client.mget(contact_rids, function (err, result) {

    if (err)
      return log_it(err, true);

    online_contacts = result;

    var multi = null;
    var one_online = false;

    _.each(online_contacts, function (v, i) {
      if (!v)
        return;
      if (!multi)
        multi = redis_client.multi();

      var c_name    = contacts[i];
      var rid       = contact_rids[i];
      var contact_menu = {};

      // Insert EACH owner into contacts[i]:
      _.each(o_menu, function (c_hash, o_name) {
        if (!c_hash[c_name])
          return null;

        contact_menu[o_name] = 1;

        var o     = {}
        o[c_name] = 1;

        // Insert contact into owner:
        multi.hmset(o_name + ':c', o);
        multi.expire(o_name + ':c', 20);
      });

      // Insert owner into contact:
      multi.hmset(rid + ':c', contact_menu);
      multi.expire(rid + ':c', 20);

    });

    var o   = {menu: menu_by_c};
    var msg = 'FIN.';

    if (!multi)
      return write_json_success(resp, msg, o);

    multi.exec(function (err, replys) {
      if (err)
        log_it(err);
      return write_json_success(resp, msg, o);
    });

  });


Contact.prototype.read_contacts_for = function (screen_name_id, flow) {
  var me = this;
  var db = new pg.query();
  db.q("SELECT contacts.*, screen_names.screen_name \
       FROM contacts INNER JOIN screen_names \
         ON (contacts.owner_id = screen_names.id AND screen_names.trashed_at IS NULL)\
       WHERE contacts.owner_id IN ($1) \
         AND contacts.contact_id = $2 \
         AND contacts.trashed_at IS NULL;",
       [me.screen_name_ids(), screen_name_id]);

  db.run_and_then(function (meta) {
    me.data.contact_menu = {};
    _.each(meta.rows, function (r) {
      me.data.contact_menu[r.screen_name] = true;
    });

    flow.finish(me);
  });

};

Contact.prototype.read_mutual_contacts = function (flow) {
  var me  = this;
  var db  = new pg.query();
  var sql = "\
SELECT \
  all_contacts.owner_id,                                  \
  owner_screen_names.screen_name AS owner_screen_name,    \
  all_contacts.contact_id,                                \
  contact_screen_names.screen_name AS contact_screen_name \
FROM                                                      \
(                                                         \
  SELECT id, owner_id, contact_id                         \
  FROM contacts                                           \
  WHERE trashed_at IS NULL AND owner_id IN                \
    (                                                     \
      SELECT id                                           \
      FROM screen_names                                   \
      WHERE screen_names.owner_id = $1                    \
      AND screen_names.trashed_at IS NULL                 \
    )                                                     \
) AS all_contacts   \
INNER JOIN          \
(                   \
  SELECT owner_id   \
  FROM contacts     \
  WHERE trashed_at IS NULL AND contact_id IN \
  (                 \
     SELECT id      \
     FROM screen_names                    \
     WHERE screen_names.owner_id = $1     \
     AND screen_names.trashed_at IS NULL  \
   )                                      \
 ) AS other_contacts ON                   \
(all_contacts.contact_id = other_contacts.owner_id)       \
  LEFT OUTER JOIN screen_names AS owner_screen_names      \
  ON (all_contacts.owner_id = owner_screen_names.id)      \
  LEFT OUTER JOIN screen_names AS contact_screen_names    \
  ON (all_contacts.contact_id = contact_screen_names.id)  \
";
  var vals = [me.data.id];
  db.q(sql, [me.data.id]);
  db.run_and_then(function (meta) {

    var menu_by_c = {};
    var menu_by_o = {};

    _.each(meta.rows, function(v, i) {

      var c_n = v.contact_screen_name;
      var o_n = v.owner_screen_name;

      if (!menu_by_c[c_n])
        menu_by_c[c_n] = [];

      if (!menu_by_o[o_n])
        menu_by_o[o_n] = []

      menu_by_c[c_n].push(o_n);
      menu_by_o[o_n].push(c_n);

    });

    flow.finish(meta.rows, menu_by_c, menu_by_o);
  });
};

Contact.prototype.update_contacts = function (new_vals, flow) {
  var me         = this;
  var record_id  = pg.generate_id(new_vals.ip);
  var contact_id = null;
  var sql = "UPDATE contacts \
           SET trashed_at = (now() AT TIME ZONE 'UTC') \
           WHERE owner_id IN ( $1 ) AND contact_id = $2;";

  Customer.read_by_screen_name(new_vals.contact_screen_name, function (c) {

    contact_id = c.screen_name_id(new_vals.contact_screen_name);

    var db = new pg.query();
    var ignore     = _.difference(me.screen_names(), new_vals.as);
    var ignore_ids = me.screen_name_ids(ignore);
    var owner_ids  = me.screen_name_ids(new_vals.as);

    _.each( owner_ids, function (owner_id) {

      db.ignore_next_duplicate('unique_to_owner');
      db.q("INSERT INTO contacts (id, owner_id, contact_id) \
           VALUES ($1, $2, $3);",
           [record_id, owner_id, contact_id]
          );

    });

    if (owner_ids.length > 0) {
      db.q("UPDATE contacts \
           SET trashed_at = null \
           WHERE owner_id IN ( $1 ) AND contact_id = $2;",
           [owner_ids, contact_id]
          );
    }

    if (ignore_ids.length > 0)
      db.q(sql, [ignore_ids, contact_id]);

    db.run_and_then(function (meta) { flow.finish(meta); });

  });

};
