
CREATE TABLE consume (

  id                serial              NOT NULL PRIMARY KEY,
  class_id          INTEGER             NOT NULL,

  author_id         integer             NOT NULL,
  is_by_computer    boolean             NOT NULL DEFAULT false,

  pub_id            integer             NOT NULL,
  pub_class_id      smallint            NOT NULL,

  consumer_id       integer             NOT NULL,
  consumer_class_id smallint            NOT NULL,

  settings          text                NOT NULL DEFAULT '{}',

  last_read_at      timestamp with time zone,
  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at        timestamp with time zone,

  -- author_id is not needed in unique index
  --   because it is describing a relationship
  --   between the PUB and the CONSUMER.
  --   Therefore, the AUTHOR is irrelevent.
  CONSTRAINT   "consume_unique_idx"
    UNIQUE (class_id, pub_id, consumer_id, pub_class_id, consumer_class_id)

);

-- This index helps to speed up reads such as:
--  what is this CONSUMER subscribed to.
--  what is this CONSUMER a child of?
CREATE INDEX consume_consumer_id_idx
  ON consume (class_id, consumer_id, pub_id, consumer_class_id);

-- DOWN

DROP TABLE IF EXISTS consume CASCADE;



