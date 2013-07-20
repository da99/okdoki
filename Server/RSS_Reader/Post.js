
var _         = require("underscore")

, Screen_Name = require("../Screen_Name/model").Screen_Name
, Feed        = require("./Feed").Feed
, Sub         = require("./Sub").Sub
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
    feed_id    : raw_data.feed_id,
    guid       : raw_data.guid || (new Date).getTime().toString(),
    link       : raw_data.link,
    author     : raw_data.author.slice(0,255),
    title      : raw_data.title.slice(0,255),
    body       : body,
    created_at : raw_data.pubdate,
    updated_at : raw_data.date
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

Post.update_next_feed = function (feed, flow) {
  var items = [];
  var saved_posts = [];

  request(feed.data.link)
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

      river

      .job(function (j) {
        i.feed_id = feed.data.id;
        Post.create(i, j);
      })

      .job(function (j, post) {
        saved_posts.push(post);
        j.finish(post);
      });

    });

    river
    .job(function (j) {
      j.finish(saved_posts);
    })
    .run();
  });
};

// ================================================================
// ================== Read ========================================
// ================================================================

Post.read_next_for_customer = function (customer, flow) {
  var post = null;
  River.new(flow)
  .job('read from db', function (j) {
    var sql = "\
      SELECT * FROM @table           \n\
      WHERE  feed_id IN              \n\
        (SELECT feed_id FROM @SUBS   \n\
          WHERE owner IN  @names )   \n\
      LIMIT 1                        \n\
    ;";
    TABLE.run(sql, {
      names: customer.screen_names(),
      TABLES: {SUBS: Sub.TABLE_NAME}
    }, j);
  })
  .job('update sub last_read_id', function (j, rows) {
    post = rows[0];
    if (!post)
      return j.finish();

    var sql = "\
      UPDATE @SUBS                 \n\
      SET last_read_id = @post_id  \n\
      WHERE owner IN @names AND feed_id = @feed_id \n\
      RETURNING nick_name          \n\
    ;";

    TABLE.run(sql, {
      post_id : post.id,
      feed_id : post.feed_id,
      names   : customer.screen_names(),
      TABLES  : {SUBS: Sub.TABLE_NAME}
    }, j);
  })
  .job('save feed nick name', function (j, rows) {
    var r = rows && rows[0];
    if (r)
      post.chat_room = r.nick_name;
    return j.finish();
  })
  .job(function (j) {
    if (!post)
      return j.finish();
    j.finish({
      created_at_epoch: post.created_at.getTime(),
      dom_id          : 'rss' + post.id + '_' + post.created_at.getTime(),
      chat_room       : post.chat_room || '(unknown)',
      author          : '(unknown)',
      body            : post.body,
      created_at      : post.created_at,
      is_rss_post     : true
    });
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






