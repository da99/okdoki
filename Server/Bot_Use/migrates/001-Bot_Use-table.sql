
CREATE TABLE bot_use (

  id           serial    NOT NULL PRIMARY KEY,
  bot_id       integer   NOT NULL DEFAULT 0,
  sn_id        integer   NOT NULL,

  is_on        boolean   NOT NULL DEFAULT false,
  settings     text      NOT NULL DEFAULT '{}',

  created_at   timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at   timestamp with time zone,
  trashed_at   timestamp with time zone,

  CONSTRAINT   "bot_use_screen_name"   UNIQUE (sn_id, bot_id)

);


-- DOWN

DROP TABLE IF EXISTS bot_use;



