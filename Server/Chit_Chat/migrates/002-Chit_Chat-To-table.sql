
CREATE TABLE chit_chat_to (

  id                SERIAL PRIMARY KEY,

  chit_chat_id      integer                  NOT NULL,
  to_id             integer                  NOT NULL,
  to_type           smallint                 NOT NULL,

  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at        timestamp with time zone,
  trashed_at        timestamp with time zone

);


CREATE INDEX chit_chat_to_idx  ON  chit_chat_to  ( created_at, to_id, to_type );


-- DOWN

DROP TABLE chit_chat_to CASCADE;


