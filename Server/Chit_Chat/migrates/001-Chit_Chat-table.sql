

CREATE TABLE chit_chat (
  id                SERIAL PRIMARY KEY,
  from_id           integer                  NOT NULL,
  from_type         smallint                 NOT NULL,
  to_id             integer                  NOT NULL,
  to_type           smallint                 NOT NULL,

  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at        timestamp with time zone,
  trashed_at        timestamp with time zone

);

CREATE INDEX chit_chat_from_to  ON  chit_chat  ( from_id,  from_type,  to_id,    to_type );
CREATE INDEX chit_chat_to_from  ON  chit_chat  ( to_id,    to_type,    from_id,  from_type );

-- DOWN


DROP TABLE chit_chat;

