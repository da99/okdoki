
CREATE TABLE screen_name_code (
  screen_name_id integer PRIMARY KEY,
  event_name_id  character varying(100)   NOT NULL,
  code        text                     NOT NULL,
  created_at  timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at  timestamp with time zone
);

-- DOWN

DROP TABLE IF EXISTS screen_name_code;


