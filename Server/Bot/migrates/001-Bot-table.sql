
CREATE TABLE bot (
  id                   serial                   NOT NULL,
  owner_id             integer                  NOT NULL,
  owner_type           smallint                 NOT NULL,
  created_at           timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at           timestamp with time zone,
  trashed_at           timestamp with time zone,

  CONSTRAINT "bot_pkey"  PRIMARY KEY (id),
  CONSTRAINT "bot_owner" UNIQUE (owner_id, owner_type)
);



-- DOWN


DROP TABLE IF EXISTS bot;





