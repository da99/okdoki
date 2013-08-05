
var _         = require("underscore")._

, Screen_Name = require("../Screen_Name/model").Screen_Name
, Follow      = require("../Headline/Follow").Follow
, Ok          = require('../Ok/model')
, log         = require("../App/base").log
, H           = require("../App/Helpers").H

, Check       = require('da_check').Check
, River       = require('da_river').River
, Topogo      = require('topogo').Topogo
, Bling_Bling = require("bling_bling").Bling_Bling
, e_e_e       = require('escape_escape_escape').Sanitize.html
;


var Headline = exports.Headline = Ok.Model.new(function () {});

var TABLE_NAME = exports.Headline.TABLE_NAME = "Headline";
var TABLE = Topogo.new(TABLE_NAME);

Headline._new = function () {
  var o = this;
  return o;
};

Headline.prototype.to_client_side = function () {
  var o = {
    dom_id             : 'headline_' + this.data.id + '_' + this.data.created_at.getTime(),
    author             : this.data.author,
    preview            : H.preview(this.data.body),
    body_html          : Bling_Bling.new(this.data.body).to_html(),
    is_clean_body_html : true,
    created_at_epoch   : this.data.created_at.getTime()
  };
  return o;
};

// ================================================================
// ================== Helpers =====================================
// ================================================================


// ================================================================
// ================== Create ======================================
// ================================================================

Headline.create = function (raw_data, flow) {
  var data = {
    author     : raw_data.author,
    body       : e_e_e(raw_data.body)
  };

  var obj = null;

  River.new(flow)

  .job('create message', function (j) {
    TABLE.create(data, j);
  })

  .job('save record', function (j, row) {
    obj = Headline.new(row);
    j.finish(obj);
  })

  .job('update follow', function (j ) {
    Follow.after_create_headline(obj, j);
  })

  .job(function (j) {
    j.finish(obj);
  })

  .run();
};

// ================================================================
// ================== Read ========================================
// ================================================================

Headline.read_by_website = function (website, flow) {
  var sql = "  \
  SELECT id, title, body, created_at, author_id         \n\
  FROM  @table                                          \n\
  WHERE @table.website_id = @website_id                 \n\
     AND @table.trashed_at IS NULL                      \n\
  ORDER BY id DESC                                      \n\
  LIMIT 25                                              \n\
  ";
  River.new(flow)
  .job(function (j) {
    TABLE.run(sql, {website_id: website.data.id}, j);
  })
  .job('replace screen_names', function (j, list) {
    Screen_Name.replace_screen_names(list, j);
  })
  .job('epoch times', function (j, list) {
    j.finish(_.map(list, function (r) {
      r.created_at_epoch = r.created_at && r.created_at.getTime();
      return r;
    }));
  })
  .run();
};

Headline.read_old_list = function (customer, flow) {
  River.new(flow)
  .job('read list', function (j) {
  var READ_LIST = "\
      SELECT *                          \n\
      FROM @table                       \n\
      WHERE author IN (                 \n\
        SELECT publisher as author      \n\
        FROM  \"Headline_Follow\"       \n\
        WHERE owner IN @ids             \n\
         AND last_read_at >= updated_at \n\
      )                                 \n\
      LIMIT 50                          \n\
    ;";

    TABLE.run(READ_LIST, {ids: customer.screen_name_ids()}, j);
  })
  .job('to objects', function (j, list) {
    j.finish(_.map(list, function (o) {
      return Headline.new(o);
    }));
  })
  .run();
};

Headline.read_new_list = function (customer, flow) {
  River.new(flow)
  .job('update list', function (j) {
    var sql = "\
    UPDATE \"Headline_Follow\"      \n\
      SET  last_read_at = $now      \n\
    WHERE id IN ( SELECT id         \n\
      FROM \"Headline_Follow\"      \n\
      WHERE                         \n\
      owner    IN @ids              \n\
      AND last_read_at < updated_at \n\
      LIMIT 4                       \n\
    )                               \n\
    RETURNING *                     \n\
    ;";
    TABLE.run(sql, {ids: customer.screen_name_ids()}, j);
  })
  .job('read list', function (j, list) {
    var pubs = _.map(list, function (o) { return o.publisher; });
    if (!pubs.length)
      return j.finish([]);
    TABLE.run("SELECT * FROM @table WHERE author IN @names", {names: pubs}, j);
  })
  .job('to objects', function (j, list) {
    j.finish(_.map(list, function (o) {
      return Headline.new(o);
    }));
  })
  .run();
};

// ================================================================
// ================== Update ======================================
// ================================================================

// ================================================================
// ================== Trash/Untrash ===============================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================






