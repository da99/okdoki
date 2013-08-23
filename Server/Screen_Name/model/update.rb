
class Screen_Name

  def update raw_data
    validate :screen_name
    validate :about
    validate :type_id
    validate(:nick_name)
      .set_to_nil_if_empty()

    # -------------------------------
    # === Update row in customer list
    # -------------------------------

  end # === def update



var Validate_Update = Check.new('update screen name', function (vu) {

  vu.define('screen_name', Validate_Create.validations['screen_name']);

  vu.define('about', function (vador) {
    vador
    .is_null_if_empty()
    ;
  });

  vu.define('type_id', Validate_Create);

  vu.define('nick_name', function (vador) {
    vador
    .is_null_if_empty()
    ;
  });


});

S.update = function ( customer, flow ) {
  var me = S.new({});
  if (customer.new_data) {
    me.new_data = customer.new_data;
  } else {
    if (customer.owner)  {
      me.new_data = _.clone(customer);
      customer = me.new_data.owner;
      delete me.new_data.owner;
    } else {
      me.new_data = customer;
      customer = customer.owner;
    }
  }

  var row = customer.screen_name_row(me.new_data.old_screen_name || me.new_data.screen_name);

  if (!Validate_Update.run(me))
    return flow.invalid(me.errors);

  var set = {}, final_data = {};

  _.each('screen_name type_id about nick_name'.split(' '), function (key) {
    if (!me.sanitized_data.hasOwnProperty(key))
      return;

    switch (key) {

      case 'screen_name':
        if (me.new_data.old_screen_name) {
        set.screen_name = me.sanitized_data.screen_name;
        set.display_name = me.sanitized_data.display_name;
        final_data.old_screen_name = me.new_data.old_screen_name.toUpperCase();
      }
      break;

      default:
        set[key] = me.sanitized_data[key];

    };
  });

  if(set.settings)
    set.settings = JSON.stringify(set.settings);
  if(set.details)
    set.details  = JSON.stringify(set.details);

  River.new(arguments)
  .job('update screen name', me.data.screen_name, function (j) {
    Topogo.new(TABLE_NAME).update_where_set(row.id, set, j)
  })
  .job(function (j, row) {
    customer.push_screen_name_row(_.extend(set, row, final_data));
    return j.finish(customer);
  })
  .run();

};

end # === class Screen_Name update ===





