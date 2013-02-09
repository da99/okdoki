var pg = require('okdoki/lib/POSTGRESQL');
var Customer = require('okdoki/lib/Customer').Customer;


// ****************************************************************
// ******************* MAIN ***************************************
// ****************************************************************

var Post = exports.Post = function () {
};


// ****************************************************************
// ******************* Create *************************************
// ****************************************************************

Post.prototype.create_post = function (vals, river) {
  var me = this;
  me.new_data = vals;

  if (!me.must_be_valid({keys: ['ip', 'body'], prefix: 'new_'}, function (c) { river.invalid(c.errors); }))
    return false;

  var raw_seed = (me.new_data.ip + (new Date).getTime());
  var seed     = parseFloat(raw_seed.replace( /[^0-9]/g, ''));
  var post_id  = pg.generate_id(seed);

  var sql = " \
    INSERT INTO posts (id, pub_id, author_id, section_id, body) \
    VALUES            ($1, $2,     $3,        $4,        $5);   \
  ";

  var sql_vals = [
    post_id,
    me.screen_name_id(vals.customer_screen_name),
    vals.author.screen_name_id(vals.author_screen_name),
    Customer.to_section_id(vals.section_name),
    me.sanitized_data.body
  ];
  var db = new pg.query(sql, sql_vals);
  db.run_and_then(function () {
    river.finish({
      data: {
        id: post_id,
        body: me.sanitized_data.body,
        author_screen_name: vals.author_screen_name
      }
    });
  });
};


// ****************************************************************
// ******************* Read ***************************************
// ****************************************************************


Post.prototype.read_posts = function (type, n, aud, river) {
  var me              = this;
  var n_meta          = me.screen_name_row(n);
  var viewed_by_owner = (aud && aud.data.id === me.data.id)
  var vals            = [n_meta.id];
  var sql     = " \
     SELECT posts.id, posts.pub_id, posts.body, posts.created_at, posts.trashed_at \
     , posts.section_id \
     , screen_names.screen_name AS author_screen_name \
     FROM   posts INNER JOIN screen_names \
        ON (posts.author_id = screen_names.id AND screen_names.trashed_at IS NULL) \
     WHERE  pub_id = $1 \
  ";

  switch (type) {
    case 'posts':
      break;
    case 'cheers/boos':
      sql += " AND section_id IN ( $2, $3 )  ";
      vals.push(Customer.to_section_id('cheer').toString());
      vals.push(Customer.to_section_id('jeer').toString());
      break;
    default:
      sql += " AND section_id = $2  ";
      vals.push(Customer.to_section_id(type));
  };

  if (!viewed_by_owner) {
    vals.push('W');
    sql += (" AND posts.read_able = $" + vals.length.toString() + " ");
  }

  if (type === 'post')
    sql += ' LIMIT 25 ';

  var db = new pg.query();
  db.on_error(river);
  db.q(sql, vals);
  db.run_and_then(function (meta) {
    _.each(meta.rows, function (r, i) {
      r.section_name = Customer.to_section_name(r.section_id);
    });
    return river.finish(meta.rows);
  });
};


Post.prototype.read_post_feed = function (river) {
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



