
var _ = require('underscore')
, Redis = require('okdoki/lib/Redis').Redis
;

var Contact = exports.Contact = function () {
};

var TABLE_NAME = Contact.TABLE_NAME = 'contacts';

Contact.new = function () {
  var c = new Contact;
  return c;
};

function select(o, c) {
  return SQL
  .select('*')
  .from(TABLE_NAME)
  .where('owner_id', o)
  .and('contact_id', c)
}

Contact.create = function (new_vals, flow) {
  var contact = null, read_able = false, reflected = null, existing = null;

  River.new(flow)

  .job('get contact_id', function (j) {
    Screen_Name.read_by_screen_name(new_vals.contact_screen_name, j);
  })

  .job('get existing contact if exists', function (j) {
    contact = j.river.last_reply();
    if (!contact)
      return j.finish([]);
    PG.new(j)
    .q( select(new_vals.owner_id, contact.data.id) )
    .run();
  })

  .job('get reflected contact if exists', function (j) {
    existing = j.river.last_reply()[0];
    if (!contact || existing)
      return j.finish([]);
    PG.new(j)
    .q( select(contact.data.id, new_vals.owner_id) )
    .run();
  })

  .run_and_on_finish(function (r) {
    reflected = r.last_reply()[0];
    if (!contact || (contact.data.read_able != 'W' && !reflected))
      return flow.invalid("Screen_Name not found: " + new_vals.contact_screen_name);
    if (existing && !existing.trashed_at)
      return flow.finish(Contact.new(existing));
    if (existing && existing.trashed_at)
      return Contact.new(existing).update({trashed_at: null}, flow);
    PG.new(flow)
    .insert_into(TABLE_NAME)
    .values({owner_id: new_vals.owner_id, contact_id: contact.data.id})
    .run();
  })
  ;
}; // end .create


//
// Read a list of contacts for all screen_names of
// a customer who have listed screen_name as a
// contact:
//
//   my_life_1 -> The.Ted.Nelson
//   my_life_2 -> The.Ted.Nelson
//   my_life_3 -> The.Ted.Nelson
//
Contact.read_list_of_owners_to_contact = function (customer, flow) {

  var customer_id = customer.data.id
  , contact_id    = null
  , owner_ids     = customer.screen_name_ids()
  ;

  River.new(flow)
  .job('get contact_id', function (j) {
    Screen_Name.read_by_screen_name(customer.new_data.contact_screen_name, j);
  })
  .job('get contacts', function (j) {
    var last_reply = j.river.last_reply();
    if (!last_reply)
      return j.finish([]);

    contact_id = last_reply.data.id;

    PG.new(j)

    .q("SELECT contacts.*, screen_names.screen_name \
       FROM contacts INNER JOIN screen_names \
       ON (contacts.owner_id = screen_names.id AND screen_names.trashed_at IS NULL)\
       WHERE contacts.owner_id IN ( " + _.map(owner_ids, function (v, 1) {return '$' + (i+1);}).join(', ') + " ) \
       AND contacts.contact_id =  $" + owner_ids.length + "  \
       AND contacts.trashed_at IS NULL;",
       [owner_ids, contact_id]
      )

    .run_and_on_finish(function (rows) {
      customer.data.contact_menu = {};
      _.each(rows, function (r) {
        customer.data.contact_menu[r.screen_name] = true;
      });

      j.finish(customer);
    });

  }).run_and_on_finish(function (r) {
    flow.finish(r.last_reply());
  });

}; // end .read_list

//
// Which reflected contacts are online?
//
//   my_life_1 <-> nelson.1
//   my_life_1 <-> wirth.4
//   my_life_2 <-> key.5
//
Contacts.read_list_online = function () {

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

}; // end .read_list_online

//
// Sends back a list of all reflected contacts
// for all screen_names of an owner:
//
//   my.life.1 <-> person.1
//   my.life.1 <-> netson.3
//   my.life.1 <-> wirth.4
//   my.life.2 <-> wirth.4
//   my.life.3 <-> kay.1
//   my.life.5 <-> nelson.3
//
Contact.read_menu = function (flow) {
  var me  = this;
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
  PG.new(flow)
  db.q(sql, [me.data.id]);
  db.run_and_on_finish(function (rows) {

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
}; // end .

Contact.update = function (new_vals, flow) {
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

}; // end .update










