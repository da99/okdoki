
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
