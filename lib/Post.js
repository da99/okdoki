var _    = require('underscore')
, Topogo = require('topogo').Topogo
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
      title      : me.sanitized_data.title
      body       : me.sanitized_data.body
    })
  )
  .run(function (row) {
    flow.finish(Post.new(row));
  });

};


// ****************************************************************
// ******************* Read ***************************************
// ****************************************************************

Post.read = function (customer, flow) {
  var sql = "\
    WITH screen_names AS lifes (                                \
      SELECT id                                                 \
      FROM screen_names                                         \
      WHERE owner_id = $1                                       \
    )                                                           \
    SELECT *,                                                   \
       CASE WHEN $1 IN (SELECT * FROM lifes)                    \
       THEN true                                                \
       ELSE FALSE                                               \
       END  AS is_author                                        \
    FROM posts                                                  \
    WHERE                                                       \
      author_id IN (SELECT * FROM lifes)                        \
      OR (                                                      \
        (read_able = 'W'                                        \
        OR read_able_list && ARRAY(SELECT * FROM lifes)         \
        )                                                       \
        AND NOT                                                 \
        (un_read_able_list && ARRAY(SELECT * FROM lifes))       \
      )                                                         \
    ;";

  PG.new('read post', flow)
  .q(sql, [customer.data.id])
  .reply(function (row) {
    var p = (!row.is_author)
      Post.new({title: row.title, body: row.body, created_at: row.created_at}) :
      Post.new(row);
    return p;
  })
  .run();
};

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
  .reply(function (rows) {
    _.each(rows, function (r, i) {
      r.section_name = Post.to_section_name(r.section_id);
    });
    return rows;
  })
  .run();
};


//
// Customer wants to see all posts from their
// follows regardless of which life they subscribed.
//
Post.read_list_of_post_feed = function (customer, river) {
  var me  = this;
  var sql = " \
    WITH screen_names as lifes (  \
      SELECT id                   \
      FROM screen_names           \
      WHERE owner_id = $1         \
    ),                            \
    follows as pubs (             \
      SELECT pub_id               \
      FROM follows                \
      WHERE follower_id IN (SELECT * FROM lifes)) \
    )                             \
    SELECT *                      \
    FROM posts                    \
    WHERE                         \
      pub_id IN ( SELECT * FROM pubs )                            \
      AND     (    read_able_list && ARRAY(SELECT * FROM lifes) ) \
      AND NOT ( un_read_able_list && ARRAY(SELECT * FROM lifes) ) \
    ORDER BY created_at DESC                                      \
    LIMIT 20                                                      \
  ;";

  PG.new('read post feed', flow)
  .q(sql, [me.data.id])
  .reply(function (rows) {
    return rows;
  })
  .run();

}; // end .read_list_of_post_feed



