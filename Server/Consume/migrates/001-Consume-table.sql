
CREATE TABLE consume (

  id                serial              NOT NULL PRIMARY KEY,
  producer_id       integer             NOT NULL,
  producer_class_id smallint            NOT NULL,
  consumer_id       integer             NOT NULL,
  consumer_class_id smallint            NOT NULL,

  settings          text                NOT NULL DEFAULT '{}',

  last_read_at      timestamp with time zone,
  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at        timestamp with time zone,

  CONSTRAINT   "consume_unique_idx"
    UNIQUE (producer_id, consumer_id, producer_class_id, consumer_class_id)

);

CREATE INDEX consume_consumer_id_idx
  ON consume (consumer_id, producer_id, consumer_class_id);

-- DOWN

DROP TABLE IF EXISTS consume CASCADE;



