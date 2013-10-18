

CREATE TABLE chit_chat (
  id                SERIAL PRIMARY KEY,

  pub_id            integer                  NOT NULL,
  author_id         integer                  NOT NULL,

  body              text                     NOT NULL,
  comment_count     smallint                 NOT NULL DEFAULT 0,

  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at        timestamp with time zone

);

CREATE INDEX chit_chat_pub_and_author_idx  ON  chit_chat  ( pub_id, author_id );

-- DOWN


DROP TABLE chit_chat CASCADE;

