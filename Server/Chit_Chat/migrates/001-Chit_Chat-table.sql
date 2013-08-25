

CREATE TABLE chit_chat (
  id                SERIAL PRIMARY KEY,
  from_id           integer                  NOT NULL,
  from_type         smallint                 NOT NULL,
  to_id             integer                  NOT NULL,

  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at        timestamp with time zone,
  trashed_at        timestamp with time zone

);


-- DOWN


DROP TABLE chit_chat;

