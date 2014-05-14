
CREATE TABLE computer (

  id                SERIAL                PRIMARY KEY,

  class_id          smallint              NOT NULL,

  parent_id         integer               NOT NULL,
  parent_class_id   smallint              NOT NULL,

  author_id         integer               NOT NULL,
  code_author_id    integer               NOT NULL,

  file_name         varchar(15)           NOT NULL,
  title             varchar(60)           NOT NULL,

  code           text                     DEFAULT NULL,
  ss_code        text                     DEFAULT NULL,

  created_at     timestamp with time zone NOT NULL    DEFAULT timezone('UTC'::text, now()),
  updated_at     timestamp with time zone,

  CONSTRAINT "computer_unique_idx"
    UNIQUE (parent_id, parent_class_id, file_name)

);


-- DOWN


DROP TABLE IF EXISTS computer CASCADE;





