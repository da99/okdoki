
CREATE TABLE bot_use (

  id           serial    NOT NULL,
  bot_id       integer   NOT NULL DEFAULT 0,
  owner_id     integer   NOT NULL,
  target_id    integer   NOT NULL,
  target_type  smallint  NOT NULL DEFAULT 0,
  is_on        boolean   NOT NULL DEFAULT false,

  settings     text,

  created_at   timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at   timestamp with time zone,
  trashed_at   timestamp with time zone,

  CONSTRAINT   "bot_use_pkey"    PRIMARY KEY (id),
  CONSTRAINT   "bot_use_owner"   UNIQUE (owner_id, bot_id, target_id, target_type),
  CONSTRAINT   "bot_use_target"  UNIQUE (target_id, target_type)

);


-- DOWN

DROP TABLE IF EXISTS bot_use;



