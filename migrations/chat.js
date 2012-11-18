var pg = require('pg')
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
query = client.query('CREATE TABLE IF NOT EXISTS bot_chat (id serial, date bigint, msg text, author varchar(20))');
query = client.query(' \
    CREATE TABLE IF NOT EXISTS consumers ( \
      id varchar(15), \
      created_at integer,  \
      trashed_at integer,  \
      contact_info text,   \
      passphrase_hash,     \
)');
query = client.query(' \
    CREATE TABLE IF NOT EXISTS masks ( \
      id varchar(15) UNIQUE,   \
      consumer_id varchar(15), \
      created_at integer,  \
      trashed_at integer,  \
      name varchar(10) NOT NULL UNIQUE \
)');
query.on('end', function() { client.end(); });
