#!/usr/bin/env node

// Create databases: okdoki

var Topogo = require('okdoki/lib/Topogo').Topogo
, SQL      = require('okdoki/lib/SQL').SQL
, Customer = require('okdoki/lib/Customer').Customer
, Chat_Bot = require('okdoki/lib/Chat_Bot').Chat_Bot
, River    = require('okdoki/lib/River').River;

var _      = require('underscore');

var cmd         = (process.argv[2] || 'nothing')
, is_reset_user = cmd === 'reset_with_data'
, is_reset      = cmd === 'reset' || is_reset_user
, is_up         = is_reset || cmd === 'up'
, is_down       = is_reset || cmd === 'down'
, now           = SQL.now
;

if (!is_up && !is_down) {
  console.log('Unknown cmd: ' + process.argv[2]);
  process.exit(1);
}

var ok = {
  list : [],
  q: function (string) {
    this.list.push(string);
    return this;
  }
};

function down(names, flow) {
  var public = [];
  var r = River.new(arguments);

  if (!is_down)
    return flow.finish(public);

  _.each(names, function (n, i) {
    if (n.indexOf('public.') === 0 ) {
      public.push(n);
      r.job('drop', n, function (j) {
        Topogo.new(n).drop(j);
      });
    };
  });

  r.reply('public tables', function (reply, river) {
    return public;
  });

  r.run();
}

function up(flow) {
  if (!is_up)
    return flow.finish();

  // ok.q("CREATE EXTENSION IF NOT EXISTS pgcrypto");

  // ok.q(" \
       // CREATE OR REPLACE FUNCTION public.json_get_varchar_array(j text, k text) \
       // RETURNS varchar[] \
       // AS $$    \
       // import json; \
       // d = json.loads(j or '{}'); \
       // return d[k] if k in d else []; \
       // $$ LANGUAGE plpython3u; \
  // ");

  // ok.q(" \
       // CREATE OR REPLACE FUNCTION public.json_get_text_array(j text, k text) \
       // RETURNS text[] \
       // AS $$    \
       // import json; \
       // d = json.loads(j or '{}')[k]; \
       // return  d[k] if k in d else []; \
       // $$ LANGUAGE plpython3u; \
  // ");

   // ok.q(" \
        // CREATE OR REPLACE FUNCTION public.json_get(j text, k text) \
        // RETURNS text \
        // AS $$    \
        // import json; \
        // d = json.loads(j or '{}')[k]; \
        // return  d[k] if k in d else \"\"; \
        // $$ LANGUAGE plpython3u; \
  // ");

     // ok.q(" \
          // CREATE OR REPLACE FUNCTION public.json_merge(o text, n text) \
          // RETURNS text \
          // AS $$    \
          // import json; \
          // oj = json.loads(o or \"{}\");   \
          // nj = json.loads(n or \"{}\");   \
          // f  = dict(list(oj.items()) + list(nj.items())); \
          // return json.dumps(f);         \
          // $$ LANGUAGE plpython3u; \
 // ");

// ok.q(" \
// CREATE OR REPLACE FUNCTION encode_pass_phrase(varchar) \
// RETURNS varchar \
// AS $$ \
// SELECT encode(digest($1, 'sha512'), 'hex') \
// $$ LANGUAGE SQL STRICT IMMUTABLE; \
// ");

ok.q(" \
CREATE TABLE IF NOT EXISTS customers ( \
id varchar(" + Topogo.id_size + ") PRIMARY KEY, \
trashed_at timestamp default null,   \
email text,                 \
pass_phrase_hash varchar(150) NOT NULL \
)");

ok.q( " \
CREATE TABLE IF NOT EXISTS screen_names ( \
id                  varchar(" + Topogo.id_size + ") PRIMARY KEY,   \
owner_id            varchar(" + Topogo.id_size + ") NOT NULL, \
screen_name         varchar(15) NOT NULL UNIQUE,  \
display_name        varchar(15) NOT NULL UNIQUE,  \
nick_name           varchar(30) default NULL,  \
read_able           varchar(1) default 'N', \
read_able_list      varchar(100) ARRAY,   \
un_read_able_list   varchar(100) ARRAY,   \
about               text default null    \
, trashed_at        timestamp default NULL \
)");

ok.q("CREATE INDEX ON screen_names (owner_id)");

ok.q( " \
CREATE TABLE IF NOT EXISTS bots         ( \
id                  varchar(" + Topogo.id_size + ") PRIMARY KEY,   \
owner_id            varchar(" + Topogo.id_size + ") NOT NULL, \
name                varchar(15) NOT NULL UNIQUE,  \
nick_name           varchar(30) default NULL,  \
read_able           varchar(1) default 'W', \
read_able_list      varchar(100) ARRAY,   \
un_read_able_list   varchar(100) ARRAY,   \
url                 text default null    \
, trashed_at        timestamp default NULL \
)");

ok.q( " \
CREATE TABLE IF NOT EXISTS home_pages ( \
owner_id            varchar(" + Topogo.id_size + ") PRIMARY KEY, \
title               text default null,  \
about               text default null    \
)");

ok.q(" \
 CREATE TABLE IF NOT EXISTS comments ( \
 id                varchar(" + Topogo.id_size + ") NOT NULL UNIQUE, \
 author_id         varchar(" + Topogo.id_size + ") NULL, \
 conv_id           varchar(" + Topogo.id_size + ") NOT NULL UNIQUE, \
 ref_id            varchar(" + Topogo.id_size + ") NOT NULL UNIQUE, \
 settings          text default null,       \
 details           text default null,       \
 body              text NOT NULL,         \
 updated_at        timestamp default null, \
 trashed_at        timestamp default null  \
 )");

 ok.q(" \
CREATE TABLE IF NOT EXISTS follows  ( \
id                varchar(" + Topogo.id_size + ") PRIMARY KEY, \
pub_id            varchar(" + Topogo.id_size + ") NULL, \
follower_id       varchar(" + Topogo.id_size + ") NULL, \
settings          text default null,       \
details           text default null,       \
body              text,         \
trashed_at        timestamp default null \
)");

ok.q("CREATE INDEX ON follows (follower_id)");

ok.q(" \
CREATE TABLE IF NOT EXISTS contacts ( \
id                varchar(" + Topogo.id_size + ") PRIMARY KEY, \
\"from_id\"          varchar(" + Topogo.id_size + ") NULL, \
\"to_id\"            varchar(" + Topogo.id_size + ") NULL, \
trashed_at        timestamp default null \
, CONSTRAINT unique_from_id UNIQUE (\"from_id\", \"to_id\") \
)");

ok.q(" \
CREATE UNLOGGED TABLE IF NOT EXISTS online_customers ( \
id                varchar(" + Topogo.id_size + ") PRIMARY KEY, \
customer_id       varchar(" + Topogo.id_size + ") NULL, \
screen_name_id    varchar(" + Topogo.id_size + ") NULL, \
last_seen_at      timestamp default " + now + "  \
, CONSTRAINT unique_customer_id_to_screen_name_id UNIQUE (customer_id, screen_name_id) \
)");

ok.q(" \
CREATE UNLOGGED TABLE IF NOT EXISTS ims ( \
id              varchar(" + Topogo.id_size + ") PRIMARY KEY,     \
client_id       varchar(" + Topogo.id_size + ") default NULL,    \
re_id           varchar(" + Topogo.id_size + ") default NULL,    \
re_client_id    varchar(" + Topogo.id_size + ") default NULL,    \
\"from_id\"        varchar(" + Topogo.id_size + ") NOT NULL,        \
\"to_id\"          varchar(" + Topogo.id_size + ") default 'W',     \
labels          varchar(15) ARRAY,    \
body            text                  \
)");

ok.q(" \
CREATE TABLE IF NOT EXISTS labels   ( \
id                varchar(" + Topogo.id_size + ") NOT NULL UNIQUE, \
owner_id          varchar(" + Topogo.id_size + ") NULL, \
label             varchar(40) NULL, \
trashed_at        timestamp default null \
, UNIQUE (owner_id, label) \
)");

ok.q(" \
CREATE TABLE IF NOT EXISTS labelings ( \
id              varchar(" + Topogo.id_size + ") NOT NULL UNIQUE, \
pub_id          varchar(" + Topogo.id_size + ") NOT NULL,        \
label_id        varchar(" + Topogo.id_size + ") NOT NULL, \
trashed_at      timestamp default null   \
, UNIQUE (pub_id, label_id) \
)");

ok.q(" \
CREATE TABLE IF NOT EXISTS posts ( \
  id                  varchar(" + Topogo.id_size + ") PRIMARY KEY,     \
  pub_id              varchar(" + Topogo.id_size + ") NOT NULL,        \
  re_id               varchar(" + Topogo.id_size + ") NOT NULL,        \
  author_id           varchar(" + Topogo.id_size + ") NOT NULL,        \
  section_id          smallint NOT NULL,           \
  title               varchar(100) default null,   \
  body                text,                        \
  extra               text default '{}',           \
  read_able           varchar(1) default 'W',      \
  read_able_list      varchar(100) ARRAY,          \
  un_read_able_list   varchar(100) ARRAY,          \
  trashed_at          timestamp default null       \
)");


  var r = River.new(flow);

  _.each(ok.list, function(v) {
    r.job('query', function (j) {
      Topogo.run(Topogo.new('unknown table'), v, [], j);
    });
  });

  r.run();
} // end func up

function create(flow) {
  console.log('Finished migrating the main db.');
  if (!is_reset_user) {
    return flow.finish();
  }

  var p     = "pass phrase";
  var report = function (j) {
    console.log('Finished ' + j.group + ' ' + j.id);
  };

  var c_opts = {pass_phrase: p, confirm_pass_phrase: p, ip: '000.000.00'};

  var r = River.new(arguments);
  r.for_each_finish(report);
  r.job('create:', 'go99', function (j) {
    Customer.create(_.extend({screen_name: j.id}, c_opts), (j));
  });

  r.job('create:', 'dos', function (j) {
    Customer.create(_.extend({screen_name: j.id}, c_opts), (j));
  });

  r.job('create bot:', '404', function (j) {
    var c = j.river.reply_for('create:', 'go99');
    Chat_Bot.create({owner_id: c.data.id, url: "https://okdoki-bot.herokuapp.com/test/404/404", name: j.id}, (j));
  });

  r.job('create bot:', 'ok', function (j) {
    var c = j.river.reply_for('create:', 'go99');
    Chat_Bot.create({owner_id: c.data.id, url: "https://okdoki-bot.herokuapp.com/test/ok", name: j.id}, (j));
  });

  r.job('create bot:', 'im', function (j) {
    var c = j.river.reply_for('create:', 'dos');
    Chat_Bot.create({owner_id: c.data.id, url: "https://okdoki-bot.herokuapp.com/test/im", name: j.id}, (j));
  });

  r.job('create bot:', 'not_json', function (j) {
    var c = j.river.reply_for('create:', 'dos');
    Chat_Bot.create({owner_id: c.data.id, url: "https://okdoki-bot.herokuapp.com/test/not_json", name: j.id}, (j));
  });

  r.run();

};

// ==========================================================================================

River.new(null)
.job('get table list'      , function (j) { Topogo.show_tables(j); })
.job('migrate down'        , function (j) { down(j.river.last_reply(), j); })
.job('migrate up'          , function (j) { up(j); })
.job('create default data' , function (j) { create(j); })
.run();


// ==========================================================================================


