
CREATE TABLE screen_name_code_subscribe (

  id           serial    NOT NULL PRIMARY KEY,
  producer_id  integer   NOT NULL DEFAULT 0,
  consumer_id  integer   NOT NULL,

  is_on        boolean   NOT NULL DEFAULT true,
  settings     text      NOT NULL DEFAULT '{}',

  created_at   timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at   timestamp with time zone,

  CONSTRAINT   "screen_name_code_subscribe_unique"   UNIQUE (producer_id, consumer_id)

);


-- DOWN

DROP TABLE IF EXISTS screen_name_code_subscribe;



