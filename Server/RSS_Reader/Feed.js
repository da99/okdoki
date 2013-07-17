
var _         = require("underscore")._

, Screen_Name = require("../Screen_Name/model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
;

var request    = require("request");
var cheerio    = require("cheerio");

var Feed       = exports.Feed = Ok.Model.new(function () {});

var TABLE_NAME = exports.Feed.TABLE_NAME = "RSS_Feed";
var TABLE      = Topogo.new(TABLE_NAME);

Feed._new = function () {
  var o = this;
  return o;
};

function null_if_empty(str) {
  if (!str) return null;
  str = str.trim();
  if (!str.length)
    return null;
  return str;
}

// ================================================================
// ================== Create ======================================
// ================================================================
Feed.create = function (raw_data, flow) {
  var url = raw_data.url.trim();
  if (!url.match(/^https?/i))
    url = 'http://' + url;

  var data = {
    url: url
  };

  River.new(flow)
  .job(function (j) {
    TABLE
    .on_dup(TABLE_NAME + '_url', function (name) {
      TABLE.read_one(data, j);
    })
    .create(data, j);
  })
  .job(function (j, record) {
    j.finish(Feed.new(record));
  })
  .run();
};

// ================================================================
// ================== Read ========================================
// ================================================================
Feed.read_list = function (flow) {
  River.new(flow)
  .job(function (j) {
    TABLE.run("SELECT * FROM @table;", {}, j);
  })
  .job(function (j, list) {
    j.finish(_.map(list, function (r) {
      return Feed.new(r);
    }));
  })
  .run();
};

Feed.find_feed_url = function (url, flow) {
  request(url, function (error, response, body) {
    if (error || response.statusCode !== 200 )
      flow.finish(null);
    var type = response.headers['content-type'];

    if (type.match('html'))
      return flow.finish(cheerio.load(response.body)('link[rel="alternate"]').attr('href'));

    if (type.match('application') || type.match('xml') || type.match('atom') || type.match('json'))
      return flow.finish(url);

    if (type.match('text')) {
      var o = null;
      try {
        o = JSON.parse(response.body);
      } catch (e) {
        o = null;
      }
      return flow.finish(o);
    }

    flow.finish();
  })
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






