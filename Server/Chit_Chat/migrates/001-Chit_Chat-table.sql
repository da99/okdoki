

CREATE TABLE chit_chat (
  id                SERIAL PRIMARY KEY,

  from_id           integer                  NOT NULL,

  body              text                     NOT NULL,
  comment_count     smallint                 NOT NULL DEFAULT 0,

  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at        timestamp with time zone

);

CREATE INDEX chit_chat_from_idx  ON  chit_chat  ( from_id );

-- DOWN


DROP TABLE chit_chat CASCADE;

