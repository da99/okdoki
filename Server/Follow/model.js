
var _         = require("underscore")

, Follow      = require("./model").Follow
, Screen_Name = require("./model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Topogo      = require("topogo").Topogo
, Check  = require('da_check').Check
, River       = require("da_river").River
;

var Follow = exports.Follow = Ok.Model.new(function () {});
var TABLE_NAME = exports.Follow.TABLE_NAME = "Follow";
var TABLE = Topogo.new(TABLE_NAME);

Follow.new = function (data) {
  var o = new Follow();
  o.data = data;
  return o;
};

function null_if_empty(str) {
  if (!str) return null;
  str = str.trim();
  if (!str.length)
    return null;
  return str;
}

Follow.prototype.is_world_read_able = function () {
  return _.contains(this.data.read_able || [], WORLD);
};


// ================================================================
// ================== Create ======================================
// ================================================================
Follow.create_by_website = function (website, raw_data, flow) {
  var data = {
    website_id: website.data.id,
    follower_id: raw_data.follower_id
  };

  River.new(flow)
  .job(function (j) {
    TABLE
    .update(data, {trashed_at: null}, j);
  })
  .job(function (j, row) {
    if (row)
      return j.finish(row);
    TABLE.create(data, j);
  })
  .job(function (j, rows) {
    j.finish(Follow.new(rows[0]));
  })
  .run();
};

Follow.create = function (life_id, pub_id) {

  var id = UID.create_id();
  var f = F.new();
  var insert_data = {'pub_id': pub_id, 'follower_id': life_id};

  River.new(job)

  .job('create', 'screen name', function (j) {
    Topogo.new(TABLE_NAME).create(insert_data, j);
  })

  .job(function (j, last) {
    return j.finish(F.new(last));
  })

  .run();

};

// ================================================================
// ================== Read ========================================
// ================================================================

Follow.read_list_by_website_and_customer = function (website, customer, flow) {
  var data = {
    website_id: website.data.id,
    name_ids  : customer.screen_name_ids()
  };

  var sql = "\
    SELECT website_id                    \n\
    FROM @table                          \n\
    WHERE website_id = @website_id       \n\
      AND follower_id IN @name_ids       \n\
      AND trashed_at IS NULL             \n\
      ;                                  \n\
  ";

  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, data, j);
  })
  .run();
};


// ================================================================
// ================== Update ======================================
// ================================================================

// ================================================================
// ================== Trash/Untrash ===============================
// ================================================================
Follow.trash_by_website_and_customer = function (website, customer, flow) {
  var data = {
    website_id  : website.data.id,
    follower_id : customer.screen_name_ids()
  };

  River.new(flow)
  .job(function (j) {
    TABLE.trash_list(data, j);
  })
  .run();
};

// ================================================================
// ================== Delete ======================================
// ================================================================










