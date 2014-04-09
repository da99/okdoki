
CREATE TABLE code (

  id             SERIAL                                    PRIMARY KEY,

  class_id       smallint                 NOT NULL,

  producer_id       integer               NOT NULL,
  producer_class_id smallint              NOT NULL,

  consumer_id       integer               NOT NULL,
  consumer_class_id smallint              NOT NULL,

  code           text                     DEFAULT NULL,
  ss_code        text                     DEFAULT NULL,
  created_at     timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at     timestamp with time zone,

  CONSTRAINT "code_unique_idx"
    UNIQUE (producer_id, producer_class_id, class_id)

);


-- DOWN


DROP TABLE IF EXISTS code CASCADE;



