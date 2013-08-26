
create table bot_code (
  id          serial   PRIMARY KEY,
  bot_id      integer  NOT NULL,
  target      smallint NOT NULL DEFAULT 0,
  code        text     NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at  timestamp with time zone,
  trashed_at  timestamp with time zone
);

CREATE UNIQUE INDEX bot_code_target_idx ON bot_code (bot_id, target)
WHERE target > 0;

-- DOWN

DROP TABLE IF EXISTS bot_code;


