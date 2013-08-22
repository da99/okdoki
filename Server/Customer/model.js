

Customer.read_by_id = function (opts, flow) {

  if (_.isString(opts) || _.isNumber(opts))
    opts = {id: opts};

  var customer_row = null;
  var me          = Customer.new();
  var screen_name = opts.screen_name;
  delete opts.screen_name;

  var p           = null;

  if (opts.hasOwnProperty('pass_phrase')) {
    p = opts.pass_phrase;
    delete opts.pass_phrase;
  }

  F.run(
    opts,
    function (j) { TABLE.read_one(opts, j); },

    function (j, last) {
      if (!last)
        return flow.finish(null);
      return j.finish(last);
    },

    function (j) { // Record log in attempt if password provided.
      customer_row = j.last;
      if (!p)
        return j.finish(j.last);

      var sql = "\
      UPDATE @table                                      \n\
      SET log_in_at = CURRENT_DATE, bad_log_in_count = 0 \n\
      WHERE log_in_at != CURRENT_DATE AND id = @id       \n\
      RETURNING *                                        \n\
      ;";

      TABLE.run_and_return_at_most_1(sql, {id: row.id}, j);
    },

    function (j, last_row) { // check log in count
      var row = last_row || customer_row;
      if (!p)
        return j.finish(row);
      if (row.bad_log_in_count < 4)
        return j.finish(row);
      else
        return j.finish('invalid', 'Too many bad log-ins for today. Try again tomorrow.');
    },

    function (j, row) { // hash pass phrase
      if (!p)
        return j.finish(row);

      bcrypt.compare(p, customer_row.pass_phrase_hash, function (err, result) {
        if (err)
          return j.finish('invalid', 'Unable to process pass phrase.');
        if (result)
          return j.finish(row);

        F.run(
          function (j) {
            Topogo.new(Customer.TABLE_NAME)
            .run(
              "UPDATE @table SET bad_log_in_count = (bad_log_in_count + 1)    \n\
              WHERE id = @id                                        \n\
              RETURNING *;",
              {id: row.id},
              j
            );
          },
          function () {
            return j.finish('invalid', 'Pass phrase is incorrect. Check your CAPS LOCK key.');
          }
        );
      });
    }, // === func

    function (j, row) {
      me.is_new                = false;
      me.customer_id           = row.id;
      me.data.id               = row.id;
      me.data.email            = row.email;
      me.data.trashed_at       = row.trashed_at;
      me.data.log_in_at        = row.log_in_at;
      me.data.bad_log_in_count = row.bad_log_in_count;
      return j.finish(me);
    },

    function (j) { // === read screen name
      Ok.Model.Screen_Name.read_list(me, j);
    },

    function (j, last) {
      flow.finish(last);
    }
  ); // === .row

};


// ================================================================
// =================== Update Validations =========================
// ================================================================


var Validate_Update = Check.new('update customer', function (vc) {

  vc.define('email', function (validator) {
    // Do nothing.
  });

});

Customer.prototype.update = function (new_data, flow) {
  var me      = this;
  me.new_data = new_data;

  River.new(flow)

  .job('validate update', 'customer',  function (j) {
    Validate_Update.run(me, j)
  })

  .job('update', 'customer', function (j) {

    var set = {};
    _.each('email'.split(' '), function (key, i) {
      if (me.sanitized_data.hasOwnProperty(key))
        set[key] = me.sanitized_data[key];
    });

    Topogo.new(TABLE_NAME)
    .update_where_set(me.data.id, set, j)

  })

  .job(function (j, r) {
    me.data = r;
    return j.finish(me);
  })

  .run();

};

// ================================================================
// =================== Trash/Delete ===============================
// ================================================================

Customer.prototype.generate_trash_msg = function (name_or_row) {
  var me = this;

  if (name_or_row.screen_name) {
    var name = name_or_row.screen_name;
    var r    = name_or_row;
  } else {
    var name = name_or_row;
    var r    = me.screen_name_row(name);
  }

  if (!r.trashed_at) {

    r.trash_msg = null;

  } else {
    var durs    = new Duration(new Date(Date.now()), reltime.parse(r.trashed_at, "48 hours"));
    var is_past = durs.days < 1 && durs.hour < 1 && durs.minute < 1;
    r.trash_msg = "Screen name, " + r.screen_name;

    if (is_past) {
      r.trash_msg += ", has been deleted. There is no undo.";
    } else {
      r.trash_msg += ", has been put in trash.";
      r.trash_msg += " You have " + human_durs(durs) + " from now to change your mind before it gets completely deleted.";
    }

  }

  return r.trash_msg;
};

Customer.prototype.trash = function (flow) {
  var me = this;
  River.new()
  .job(function (j) {
    Topogo.new(TABLE_NAME)
    .trash(me.data.id, j);
  })
  .run(function (fin, last) {
    me.data.trashed_at = last.trashed_at;
    flow.finish(me);
  });
};

Customer.delete_trashed = function (flow) {

  var final = {customers: [], screen_names: []};

  River.new(flow)

  .job('delete customers', function (j) {
    Topogo.new(TABLE_NAME)
    .delete_trashed(j)
  })

  .job(function (j, rows) {
    if (!rows.length)
      return j.finish(rows);

    final.customers = rows;

    Ok.Model.Screen_Name.delete_by_owner_ids(_.pluck(rows, 'id'), j);
  })

  .job(function (j, sn_rows) {
    final.screen_names = sn_rows;
    return j.finish(final);
  })

  .run();

};





