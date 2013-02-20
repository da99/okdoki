var _ = require('underscore')
, PG  = require('okdoki/lib/PG')
, SQL = require('okdoki/lib/SQL')
;


var Post         = exports.Post = function () {};
Post.keys        = ''.split(' ');
Post.TABLE_NAME  = 'posts';
Post.section_ids = {
  1: 'random',
  2: 'status',
  3: 'event',
  4: 'emergency',
  5: 'article',
  6: 'jeer',
  7: 'cheer',
  8: 'question',
  9: 'answer'
};

// ****************************************************************
// ******************* Helpers ************************************
// ****************************************************************

Post.new = function (o) {
  var p = new Post();
  p.data = {};

  _.each(o, function (v, k) {
    if (p[k])
      p[k](v);
    else if (_.contains(Post.keys, k))
      p.data[k] = v;
  });

  return p;
};

Post.to_section_name = function (id) {
  var a = Post.section_ids[id];
  if (!a)
    throw new Error("Unknown section id: " + id);
  return a;
};

Post.to_section_id = function (name) {
  var a = _.invert(Post.section_ids)[name];
  if (!a)
    throw new Error("Unknown section name: " + name);
  return a;
};

// ****************************************************************
// ******************* Create *************************************
// ****************************************************************

Post.create = function (vals, flow) {
  var me = Post.new();
  me.new_data = vals;

  if (!Validate_Create(me))
    return flow.invalid(me.errors);

  var raw_seed = (me.new_data.ip + (new Date).getTime());
  var seed     = parseFloat(raw_seed.replace( /[^0-9]/g, ''));
  var post_id  = pg.generate_id(seed);

  PG.new('create post', flow)
  .q(
    SQL.insert_into(Post.TABLE_NAME)
    .values({
      id         : post_id,
      pub_id     : me.screen_name_id(vals.customer_screen_name),
      author_id  : vals.author.screen_name_id(vals.author_screen_name),
      section_id : Customer.to_section_id(vals.section_name),
      body       : me.sanitized_data.body
    })
  )
  .run_and_then(function (row) {
    flow.finish(Post.new(row));
  });

};


// ****************************************************************
// ******************* Read ***************************************
// ****************************************************************


//
// What content should go on the home_page of a publication?
//
//
Post.read_list_for_pub = function (customer, flow) {
  var me              = this;
  var vals            = [customer.data.id];
  var sql     = " \
     SELECT posts.title, posts.body, posts.created_at             \
     , posts.section_id                                           \
     , screen_names.screen_name AS \"from\"                       \
     FROM   posts INNER JOIN screen_names                         \
        ON posts.from_id = screen_names.id                        \
         AND screen_names.trashed_at IS NULL                      \
     WHERE  pub_id = $1                                           \
            AND (read_able = 'W' OR $1 = ANY ( read_able_list ))  \
            AND $1 != ANY (unread_able_list)                      \
            AND trashed_at IS NULL                                \
  ";

  switch (type) {
    case 'posts':
      break;
    case 'cheers/boos':
      sql += " AND section_id IN ( $2, $3 )  ";
      vals.push(Post.to_section_id('cheer').toString());
      vals.push(Post.to_section_id('jeer').toString());
      break;
    default:
      sql += " AND section_id = $2  ";
      vals.push(Post.to_section_id(type));
  };

  if (type === 'post')
    sql += ' LIMIT 10 ';

  PG.new('read posts', flow)
  .q(sql, vals)
  .run_and_on_finish(function (rows) {
    _.each(rows, function (r, i) {
      r.section_name = Post.to_section_name(r.section_id);
    });
    flow.finish(rows);
  });
};


Post.read_post_feed = function (customer, river) {
  var me  = this;
  var sql = "SELECT * \
    FROM posts  \
    WHERE       \
      pub_id IN (SELECT pub_id FROM follows WHERE screen_name_id IN (SELECT id FROM screen_names WHERE owner_id = $1)) \
      AND \
       ( allow && array_cat(ARRAY[$2]::varchar[], ARRAY(SELECT id FROM screen_names WHERE owner_id = $1))::varchar[] \
          OR  \
         allow && ARRAY(SELECT label_id FROM labelings WHERE pub_id IN (SELECT id FROM screen_names WHERE owner_id = $1))::varchar[] \
       ) \
      AND \
      NOT (disallow && array_cat(ARRAY[$2]::varchar[], ARRAY(SELECT id FROM screen_names WHERE owner_id = $1))::varchar[]) \
      AND \
      NOT (disallow && ARRAY(SELECT label_id FROM labelings WHERE pub_id IN (SELECT id FROM screen_names WHERE owner_id = $1))::varchar[])  \
    ORDER BY created_at DESC \
    LIMIT 10;";
  var db  = new pg.query();
  db.q(sql, [me.data.id, "@"]);
  db.run_and_then(function (meta) {
    var rows = _.map(meta.rows, function (r, i) {
      r.settings = JSON.parse(r.settings || '{}');
      r.details  = JSON.parse(r.details  || '{}');
      return r;
    });
    river.finish(rows);
  });
};



