

CREATE TABLE chit_chat (
  id                SERIAL PRIMARY KEY,

  type              smallint                 NOT NULL,
  from_id           integer                  NOT NULL,

  body              text                     NOT NULL,

  publish_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at        timestamp with time zone,
  trashed_at        timestamp with time zone

);

CREATE INDEX chit_chat_from_idx  ON  chit_chat  ( from_id, type, publish_at );

-- DOWN


DROP TABLE chit_chat;

