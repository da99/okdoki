
var _         = require("underscore")

, Screen_Name = require("../Screen_Name/model").Screen_Name
, Ok          = require('../Ok/model')
, log         = require("../App/base").log

, Topogo      = require("topogo").Topogo
, River       = require("da_river").River
, Check       = require('da_check').Check
;

var cheerio = require("cheerio");
var request = require('request');
var parser  = require('feedparser');


var Post = exports.Post = Ok.Model.new(function () {});

var TABLE_NAME = exports.Post.TABLE_NAME = "RSS_Post";
var TABLE = Topogo.new(TABLE_NAME);

Post._new = function () {
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
Post.create = function (raw_data, flow) {
  var body = cheerio.load(raw_data.summary || raw_data.description || raw_data.body)
  .root().text().trim().split(' ').slice(0,30).join(' ')
  .replace(/\r|\t/g, '  ') + '...';

  var data = {
    feed_id: raw_data.feed_id,
    guid:  raw_data.guid || (new Date).getTime().toString(),
    url:   raw_data.link,
    title: raw_data.title.slice(0,255),
    body:  body,
    created_at: raw_data.pubdate,
    updated_at: raw_data.date
  };

  River.new(flow)
  .job(function (j) {
    TABLE
    .on_dup(TABLE_NAME + '_post_guid', function (name) {
      TABLE.read_one({guid: data.guid}, j);
    })
    .create(data, j);
  })
  .job(function (j, record) {
    j.finish(Post.new(record));
  })
  .run();
};

Post.create_list_from_get_request = function (feed, flow) {
  var items = [];

  request(feed.data.url)
  .pipe(new parser())
  .on('error', function (error) {
    console.log(error);
    j.finish();
  })
  .on('data', function (o, o2) {
    items.push(o);
  })
  .on('readable', function (str) {
    if(arguments.length)
      console.log(arguments);
  })
  .on('finish', function () {
    var river = River.new(flow);
    _.each(items, function (i) {
      river.job(function (j) {
        i.feed_id = feed.data.id;
        Post.create(i, j);
      });
    });
    river.run();
  });
};

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





