
class Customer

  def trash
    raise "not done"
  end # === def trash

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

end # === class Customer trash ===





