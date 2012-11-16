var pg = require('pg')
  , connectionString = process.env.DATABASE_URL
  , client
  , query;

client = new pg.Client(connectionString);
client.connect();
query = client.query('CREATE TABLE IF NOT EXISTS bot_chat (date bigint, msg text, author varchar(20))');
query.on('end', function() { client.end(); });
