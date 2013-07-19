
var _         = require("underscore")._

, Post        = require("./Post").Post
, Screen_Name = require("../Screen_Name/model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
;

var request    = require("request");
var cheerio    = require("cheerio");
var FeedParser = require('feedparser')

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

  var fin = false;
  var link = raw_data.link.trim();
  if (!link.match(/^https?/i))
    link = 'http://' + link;

  River.new(flow)

  .job('read from DB', function (j) {
    TABLE.read_one({link: link}, j);
  })

  .job('read from WWW if not found', function (j, record) {

    if (record)
      return j.finish({link: record.link, title: record.title});

    var data = {};

    request(link)
    .pipe(new FeedParser())
    .on('error', function (error) {
      log(error);
      fin = true;
      j.finish('invalid', "Feed was not found.");
    })
    .on('meta', function (d) {
      data.title = d.title;
      data.link  = d.xmlurl;
    })
    .on('finish', function () {
      if (fin)
        return;

      j.finish(data);
    });

  })

  .job('create', function (j, data) {
    TABLE
    .on_dup(TABLE_NAME + '_link', function (name) {
      TABLE.read_one({link: data.link}, j);
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

Feed.update_next = function (flow) {
  var log_id       = 0;
  var next_feed_id = 0;
  var LOG          = Topogo.new('RSS_Reader_Log');
  var posts        = [];

  River.new(flow)
  .job('get last feed id', function (j) {
    LOG.run( "SELECT id, last_feed_id FROM @table LIMIT 1", {}, j);
  })
  .job('get next feed', function (j, rows) {
    var record = rows[0];
    log_id = record.id;
    TABLE
    .run("SELECT * FROM @table \
         WHERE id > @last_id \
         LIMIT 1;", {last_id: record.last_feed_id}, j);
  })
  .job('get posts', function (j, rows) {
    var f_rec = rows[0];
    next_feed_id = (f_rec) ? f_rec.id : 0;
    if (!f_rec)
      return j.finish([]);
    Post.update_next_feed(Feed.new(f_rec), j);
  })
  .job('update log', function (j, items) {
    posts = items;
    LOG.update(log_id, {last_feed_id: next_feed_id}, j);
  })
  .job(function (j) {
    j.finish({posts: posts, feed_id: next_feed_id});
  })
  .run();
};

// ================================================================
// ================== Trash/Untrash ===============================
// ================================================================

// ================================================================
// ================== Delete ======================================
// ================================================================






