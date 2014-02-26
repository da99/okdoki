
CREATE TABLE screen_name_code (
  id             serial   PRIMARY KEY,
  is_on          boolean                  NOT NULL DEFAULT false,
  screen_name_id integer                  NOT NULL,
  event_name_id  smallint                 NOT NULL,
  code           text                     DEFAULT NULL,
  ss_code        text                     DEFAULT NULL,
  created_at     timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at     timestamp with time zone
);

CREATE UNIQUE INDEX unique_screen_name_id_to_event_name_id_idx ON screen_name_code (screen_name_id, event_name_id);

-- DOWN

DROP TABLE IF EXISTS screen_name_code;


