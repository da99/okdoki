
CREATE TABLE screen_name_code (
  id             serial   PRIMARY KEY,
  screen_name_id integer                  NOT NULL,
  event_name_id  character varying(100)   NOT NULL,
  code        text                        NOT NULL,
  created_at  timestamp with time zone    NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at  timestamp with time zone
);

-- DOWN

DROP TABLE IF EXISTS screen_name_code;


