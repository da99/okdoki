
CREATE TABLE screen_name_code_consume (

  id                serial              NOT NULL PRIMARY KEY,
  is_on             boolean             NOT NULL DEFAULT true,
  producer_id       integer             NOT NULL,
  producer_class_id smallint            NOT NULL,
  consumer_id       integer             NOT NULL,
  consumer_class_id smallint            NOT NULL,

  settings          text                NOT NULL DEFAULT '{}',

  last_read_at      timestamp with time zone,
  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at        timestamp with time zone,

  CONSTRAINT   "screen_name_code_consume_unique_idx"
    UNIQUE (producer_id, consumer_id, producer_class_id, consumer_class_id)

);

CREATE INDEX screen_name_code_consume_consumer_id_idx
  ON screen_name_code_consume (consumer_id, producer_id, consumer_class_id);

-- DOWN

DROP TABLE IF EXISTS screen_name_code_consume CASCADE;



