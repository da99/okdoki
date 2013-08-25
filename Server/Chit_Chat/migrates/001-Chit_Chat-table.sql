

CREATE TABLE chit_chat (
  id                SERIAL PRIMARY KEY,

  type              smallint                 NOT NULL,
  from_id           integer                  NOT NULL,
  from_type         smallint                 NOT NULL,

  body              text                     NOT NULL,

  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at        timestamp with time zone,
  trashed_at        timestamp with time zone

);

CREATE INDEX chit_chat_from_idx  ON  chit_chat  ( created_at, from_id,  from_type, type );

-- DOWN


DROP TABLE chit_chat;

