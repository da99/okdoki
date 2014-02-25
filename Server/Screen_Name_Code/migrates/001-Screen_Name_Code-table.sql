
CREATE TABLE screen_name_code (
  id             serial   PRIMARY KEY,
  screen_name_id integer                  NOT NULL,
  event_name_id  smallint                 NOT NULL,
  who_id         smallint                 NOT NULL DEFAULT 0,
  code           text                     NOT NULL,
  created_at     timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at     timestamp with time zone
);

CREATE UNIQUE INDEX unique_screen_name_id_to_event_name_id_idx ON screen_name_code (screen_name_id, event_name_id);

-- DOWN

DROP TABLE IF EXISTS screen_name_code;


