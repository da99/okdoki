
CREATE TABLE bot (
  id                   serial                   NOT NULL,
  sn_id                integer                  NOT NULL,
  created_at           timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at           timestamp with time zone,
  trashed_at           timestamp with time zone,

  CONSTRAINT "bot_pkey"  PRIMARY KEY (id),
  CONSTRAINT "bot_screen_name" UNIQUE (sn_id)
);



-- DOWN


DROP TABLE IF EXISTS bot;





