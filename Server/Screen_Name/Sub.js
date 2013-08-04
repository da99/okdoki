
var _         = require("underscore")._

, Ok          = require('../Ok/model')
, log         = require("../App/base").log
, H           = require("../App/Helpers").H

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
, F           = require('tally_ho').Tally_Ho
;

var Sub        = Ok.Model.new(exports, 'Screen_Name_Sub');
var TABLE_NAME = Sub.TABLE_NAME = "Screen_Name_Sub";
var TABLE      = Topogo.new(TABLE_NAME);

Sub.type_ids = ['bot'];
Sub.type_map = {};
_.each(Sub.type_ids, function (v, i) {
  Sub.type_map[i] = v;
});


Sub._new = function () {
  var o = this;
  return o;
};

// ================================================================
// ================== Helpers =====================================
// ================================================================

Sub.to_type_id = function (str_or_num) {
  return _.invert(Sub.type_map)[str_or_num] || 0;
}

F.on('add screen names using user', function (f) {
  f.finish(_.map(f.last, function (o) {
    var key = o.hasOwnProperty('owner_id') ? 'owner_id' : 'author_id';
    var sn  = f.data.user.to_screen_name(o[key]);

    o.screen_name = (o.sub_sn) ?
      (o.sub_sn + '@' + sn) :
      sn;

    return o.screen_name;
  }));
});

// ================================================================
// ================== Create ======================================
// ================================================================
F.on('create Screen_Name_Sub', function (flow) {
  var data = {
    sub_sn   : H.to_canon_name_sub(flow.data.sub_sn),
    owner_id : H.to_owner_id(flow.data),
    type_id  : Sub.to_type_id(flow.data.type)
  };

  F.run(flow, function (f) {
    TABLE
    .on_dup(function (constraint_name) {
      f.finish('invalid', "You've already: " + data.sub_sn + '@' + flow.data.as_this_life);
    })
    .create(data, f);
  }, function (f) {
    f.finish(Screen_Name_Sub.new(f.last));
  });
});

// ================================================================
// ================== Read ========================================
// ================================================================


// ================================================================
// ================== Update ======================================
// ================================================================

// ================================================================
// ================== Trash/Untrash ===============================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================






