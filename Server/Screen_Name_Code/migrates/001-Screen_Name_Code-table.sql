
create table screen_name_code (
  id          serial    PRIMARY KEY,
  screen_name_id      integer  NOT NULL,
  code        text      NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at  timestamp with time zone
);

--  CREATE UNIQUE INDEX screen_name_code_target_idx ON screen_name_code (screen_name_id, target)
--  WHERE target > 0;

-- DOWN

DROP TABLE IF EXISTS screen_name_code;


