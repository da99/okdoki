
class Screen_Name

  class << self

    def read_by_id id
      r = TABLE[:id=>id]
      Screen_Name.new r, "Screen name not found."
    end

    def read_by_screen_name raw_sn
      r = TABLE.limit(1)[:screen_name=>Screen_Name.canonize(raw_sn)]
      new r, "Screen name not found: #{raw_sn}"
    end

  end # === class self ===

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





