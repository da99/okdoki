
var _         = require("underscore")._

, Ok          = require('../Ok/model')
, log         = require("../App/base").log
, H           = require("../App/Helpers").H

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
, E_E_E       = require('escape_escape_escape').Sanitize.html
, UN_ESCAPE   = require('escape_escape_escape').Sanitize.un_escape
, F           = require('tally_ho').Tally_Ho
;

require('./Code');

var Bot = Ok.Model.new(exports, 'Bot');

var TABLE_NAME = Bot.TABLE_NAME = "Bot";
var TABLE = Topogo.new(TABLE_NAME);

Bot._new = function () {
  var o = this;
  return o;
};


// ================================================================
// ================== Helpers =====================================
// ================================================================

function extract_name(o) {
  if (o.screen_name)
    return H.canonize_screen_name(o.screen_name).split('@');
  return [o.sub_sn, o.owner];
}

Bot.prototype.public_data = function () {
  var me = this;
  return {
    screen_name: me.data.screen_name
  };
};


// ================================================================
// ================== Create ======================================
// ================================================================

F.on('create Bot', function (flow) {
  F.run(flow, 'create Screen_Name_Sub', {type: 'bot'}, flow.data, function (f) {
    f.data.Screen_Name_Sub = f.last;
    TABLE.create({screen_name_sub_id: f.last.data.id}, f);
  }, function (f) {
    f.finish(Bot.new(_.extend({}, f.data.Screen_Name_Sub.public_data(), f.last)));
  });
});


// ================================================================
// ================== Read ========================================
// ================================================================

F.on('read Multi-Life Page', function (f) {
  if (!f.data.Bots)
    f.finish();
  F.run(f, 'read Bot list for owner', f.data, function (f2) {
    f.data.Bots.Own = Bot.public_data(f2.last);
    f2.finish();
  });
});

F.on('read Bot list for owner', function (f) {
  F.run(f, f.data, function (f2) {
    var sql = "\
      SELECT owner_id, sub_sn                     \n\
      FROM @SUBS                                  \n\
      WHERE type_id = @bot_type                   \n\
            AND owner_id IN @sn_ids               \n\
    ;";
    TABLE.run(sql, {
      TABLES: {SUBS: Ok.Model.Screen_Name_Sub.TABLE_NAME},
      sn_ids: f.data.user.screen_name_ids(),
      bot_type: Ok.Model.Screen_Name_Sub.to_type_id('bot')
    }, f2);
  }, "add screen names using user", function (f2) {
    f2.finish(Bot.new(f2.last));
  });
});

Bot.read_list_to_run = function (sn, flow) {
  River.new(flow)
  .job('read', function (j) {
    TABLE.run("\
              SELECT *                              \n\
              FROM @table RIGHT JOIN @SNS           \n\
                   ON @table.screen_name_sub_id =   \n\
                      @SNS.id                       \n\
              WHERE @SNS.id in (                    \n\
                SELECT bot_id                       \n\
                FROM @BU                            \n\
                WHERE owner = @sn                   \n\
              ) AND code IS NOT NULL                \n\
              ;", {sn: sn, TABLES: {
                SNS: "Screen_Name_Sub",
                BU: "Bot_Use"
              }}, j);
  })
  .job('to objects', function (j, list) {
    j.finish(_.map(list, function (r) {
      return Bot.new(r).public_data();
    }));
  })
  .run();
};

F.on('read Bot by screen name', function (flow) {

  F.run(flow, function (j) {
    var pieces = flow.data.screen_name.split('@');
    var data = {sub_sn: pieces[0], owner: pieces[1]};
    var sql = "\
      SELECT *                       \n\
      FROM @table RIGHT JOIN         \n\
        \"Screen_Name_Sub\"          \n\
        ON @table.screen_name_sub_id = \
           \"Screen_Name_Sub\".id    \n\
      WHERE sub_sn = @sub_sn AND     \n\
            owner  = @owner          \n\
      LIMIT 1                        \n\
    ;";

    TABLE.run_and_return_at_most_1(sql, data, j);
  }, function (j) {
    j.finish(Bot.new(j.last));
  });

});

Bot.read_by_screen_name = function (sn, flow) {
  var pieces = sn.split('@');
  River.new(flow)
  .job('read', function (j) {
    TABLE.read_one({sub_sn: pieces[0], owner: pieces[1]}, j);
  })
  .job('to object', function (j, last) {
    j.finish(Bot.new(last));
  })
  .run();
};

// ================================================================
// ================== Update ======================================
// ================================================================
Bot.update = function (data, flow) {
  var clean = _.pick(data, 'code', 'about_me');
  var sn    = extract_name(data);

  if (clean.about_me)
    clean.about_me = H.null_if_empty(clean.about_me);

  if (clean.code) {
    clean.code = UN_ESCAPE(clean.code);
    if (!H.is_json(clean.code)) {
      return flow.finish('invalid', 'Code is invalid JSON.');
    }
    clean.code = JSON.stringify(E_E_E(JSON.parse(clean.code)));
  }

  River.new(flow)
  .job('read sn', function (j) {
    Topogo.new("Screen_Name_Sub")
    .read_one({
      sub_sn: sn[0],
      owner: sn[1]
    }, j);
  })
  .job('update bot', function (j, last) {
    if (!last)
      return j.finish("invalid", "Bot not found: " + sn.join('@'));
    TABLE.update_one({screen_name_sub_id: last.id}, clean, j);
  })
  .job('to object', function (j, row) {
    j.finish(Bot.new(row));
  })
  .run();
};

// ================================================================
// ================== Trash/Untrash ===============================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================






