
create table bot_code (
  id          serial   NOT NULL,
  bot_id      integer  NOT NULL,
  type        smallint NOT NULL DEFAULT 0,
  code        text,
  settings    text,
  created_at  timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at  timestamp with time zone,
  trashed_at  timestamp with time zone,

  CONSTRAINT "bot_code_pkey" PRIMARY KEY (id),
  CONSTRAINT "bot_code_type" UNIQUE (bot_id, type)
);


-- DOWN

DROP TABLE IF EXISTS bot_code;


