
var _         = require('underscore')
, Topogo          = require('topogo').Topogo
, UID         = require('okdoki/lib/UID').UID
, River       = require('da_river').River
, Customer    = require('okdoki/lib/Customer').Customer
, Screen_Name = require('okdoki/lib/Screen_Name').Screen_Name
;

var Contact    = exports.Contact = function () {};
var TABLE_NAME = Contact.TABLE_NAME = 'contacts';
var TABLE      = Contact.TABLE = Topogo.new(TABLE_NAME);
var WORLD      = '@W';

Contact.new = function (data) {
  var c = new Contact;
  if (_.isObject(data) && data.hasOwnProperty('from_id')) {
    c.data= data;
  }
  return c;
};

// ****************************************************************
// ****************** Helpers *************************************
// ****************************************************************

function where(from, to) {
  return {from_id: from, to_id: to};
}


// ****************************************************************
// ****************** CREATE **************************************
// ****************************************************************


Contact.create = function (new_vals, flow) {

  var contact        = null, read_able = false, reflected = null, existing = null;
  var from_id        = new_vals.from.data.id;
  var to_id          = null;
  var to_screen_name = new_vals.to_screen_name || new_vals.to;

  River.new(flow)

  .job('read sn:', to_screen_name, function (j) {
    Screen_Name.read_by_screen_name(to_screen_name, j);
  })

  .job('get existing contact if exists', function (j, sn) {
    if (!sn)
      return j.finish([]);

    contact = sn;
    to_id   = contact.data.id;

    TABLE.read_one(where(from_id, to_id), j);
  })

  .job('get reflected contact if exists', function (j, row) {
    existing = row;
    if (!contact || existing)
      return j.finish([]);

    TABLE.read_one(where(to_id, from_id), j);
  })

  .job('save to vars', function (j, row) {

    reflected = row;

    if (!contact || (!contact.is_world_read_able() && !reflected))
      return j.invalid("Screen_Name not found: " + to_screen_name);

    if (existing && !existing.trashed_at)
      return j.finish(Contact.new(existing));

    if (existing && existing.trashed_at)
      return Contact.new(existing).update({trashed_at: null}, j);

    var insert_vals = {id: UID.create_id(), from_id: from_id, to_id: to_id};
    TABLE.create(insert_vals, j);
  })

  .job(function (j, last) {
    return j.finish(Contact.new(last));
  })

  .run();

}; // end .create

// ****************************************************************
// ****************** READ ****************************************
// ****************************************************************

//
// Get a list of contacts showing:
//   - all the lifes a person knows another single person,
//   - even if screen_name of contact is trashed
//   - but don't allow a trashed contact record.
//
//   --FROM--     --TO--
//   my_life_1 -> The.Ted.Nelson
//   my_life_2 -> The.Ted.Nelson
//   my_life_3 -> The.Ted.Nelson
//
// Accepts: customer
// Returns: customer (with data.contact_menu)
//
Contact.read_list_of_owners_to_contact = function (customer, flow) {

  var customer_id = customer.data.id
  , to_id    = null
  , owner_ids     = customer.screen_name_ids()
  ;

  River.new(flow)

  .job('get screen_name of contact', function (j) {
    Screen_Name.read_by_screen_name(customer.new_data.to_screen_name, j);
  })

  .job('get contacts', function (j, contact_sn) {
    if (!contact_sn)
      return j.finish([]);

    to_id = j.river.last_reply().data.id;
    var vals = [to_id];

    PG.new(j)

    .q(" \
       SELECT contacts.*, screen_names.* \
       FROM   contacts INNER JOIN screen_names \
              (ON contacts.from = screen_name.id)   \
       WHERE  contacts.from_id IN ( " + SQL.join_array_by_comma(owner_ids, vals) + " ) \
       AND    contacts.to_id =  $1  \
       AND    contacts.trashed_at IS NULL ;",
       vals
      )

    .job(function (rows) {
      customer.data.contact_menu = {};
      _.each(rows, function (r) {
        customer.data.contact_menu[contact_sn.screen_name] = r;
      });

      return customer;
    })

    .run();

  })

  .run();

}; // end .read_list

//
// "Which of my contacts are online?"
//
//   --FROM--       --TO--
//   my_life_1 <-> nelson.1
//   my_life_1 <-> wirth.4
//   my_life_2 <-> key.5
//
// Accepts: customer
// Returns: customer
//   with data.contacts_online =
//     new Array(contact record INNER JOIN from/to screen_name records)
//
Contact.read_list_online_status = function (customer, flow) {
  var sql = " \
    SELECT    \
       screen_names.screen_name, \
       (CASE WHEN last_seen_at >= ((now() AT TIME ZONE 'UTC') - '4 seconds'::interval)  \
        THEN TRUE      \
        ELSE FALSE     \
       END) AS online  \
    FROM contacts      \
         INNER JOIN online_customers                                  \
           ON contacts.to_id = online_customers.screen_name_id           \
         INNER JOIN screen_names                                      \
           ON online_customers.screen_name_id = screen_names.id       \
  ;";

  return PG.new('check online status of contacts for a customer', flow)
  .q(sql)
  .reply(function (rows) {
    customer.data.contacts_online_status = rows;
    return customer;
  })
  .run();

}; // end .read_list_online_status


//
// Sends back a list of all reflected contacts
// for all screen_names of an owner, even if
// both screen_names has been trashed:
//
//   --FROM--                   --TO--
//   my.life.1             <-> person.1
//   my.life.1             <-> netson.3 (trashed)
//   my.life.1             <-> wirth.4
//   my.life.2 (untrashed) <-> wirth.4
//   my.life.3             <-> kay.1
//   my.life.5             <-> nelson.3 (trashed)
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
  .q(sql, [me.data.id])
  .reply(function (rows) {

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

    return [meta.rows, menu_by_c, menu_by_o];
  })
  .run();
}; // end .



// ****************************************************************
// ****************** UPDATE **************************************
// ****************************************************************


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

    db.run(function (meta) { flow.finish(meta); });

  });

}; // end .update












