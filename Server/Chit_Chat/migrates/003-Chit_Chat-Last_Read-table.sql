
CREATE TABLE chit_chat_last_read (

  sn_id             integer                  PRIMARY KEY,
  last_read_at      timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now())

);

-- DOWN

DROP TABLE chit_chat_to CASCADE;


