
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


S.prototype.edit_homepage_title = function (val) {
  var new_val = val.toString().trim();
  if (new_val.length === 0)
    new_val = null;
  this.push_sanitized_data('homepage_title', new_val);
};

S.prototype.edit_about = function (val) {
  var new_val = val.toString().trim();
  if (new_val.length === 0)
    new_val = null;
  this.push_sanitized_data('about', new_val);
};


S.prototype.edit_homepage_allow = function (val) {
  this.validator.check(val, "'allow' must be an array.").isArray();
  this.push_sanitized_data('homepage_allow', val);
};


S.prototype.edit_screen_name = function (n) {

  var old = this.new_data.old_screen_name;

  if (old) // updating old name
    this.push_sanitized_data('screen_name_id', this.screen_name_id(old));
  else {
    // inserting new name
  }

  this['new_screen_name'](n);
};

S.prototype.edit_read_able = function (v) {
  switch (v) {
    case 'W':
      break;
    case 'N':
      break;
    case 'S':
      break;
    default:
      throw new Error('Unknown read_able value: ' + v);
  };

  this.push_sanitized_data('read_able', v);
}

S.prototype.edit_read_able_list = function (v) {
  if (this.sanitized_data.read_able !== 'S')
    return false;

  if (!v)
    throw new Error('read_able_list can\'t be false-y: ' + typeof(v));

  var list = _.reject(v.trim().split(/[,\s]+/ig), function (str, i) {
    return str === "";
  });

  if (list.length === 0)
    this.push_sanitized_data.read_able = 'N';
  else
    this.push_sanitized_data('read_able_list', list);
}

S.prototype.edit_at_url = function (v) {
  return edit_bot_url(this, 'at_url', v);
};

S.prototype.edit_at_pass_phrase = function (v) {
  return edit_bot_pass_phrase(this, 'at_pass_phrase', v);
};


S.prototype.edit_bot_url = function (v) {
  return edit_bot_url(this, 'bot_url', v);
};

S.prototype.edit_bot_pass_phrase = function (v) {
  return edit_bot_pass_phrase(this, 'bot_pass_phrase', v);
};

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





