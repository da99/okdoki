
CREATE TABLE chit_chat_to (

  id                SERIAL PRIMARY KEY,

  chit_chat_id      integer                  NOT NULL,
  from_id           integer                  NOT NULL,
  to_id             integer                  DEFAULT NULL,
  to_type           smallint                 DEFAULT NULL,

  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at        timestamp with time zone,
  trashed_at        timestamp with time zone,

  CONSTRAINT        "chit_chat_to_msg" UNIQUE (chit_chat_id, to_id, to_type)
);


CREATE INDEX chit_chat_to_from_to_idx  ON  chit_chat_to  ( from_id, to_id, to_type );


-- DOWN

DROP TABLE chit_chat_to CASCADE;


