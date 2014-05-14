
CREATE TABLE computer (

  id                SERIAL                PRIMARY KEY,

  -- class_id refers to a file_name id
  class_id          smallint              NOT NULL,

  -- generated from:
  --   1 + MAX(file_id OF parent_id, parent_class_id, class_id)
  file_id           smallint              NOT NULL,

  parent_id         integer               NOT NULL,
  parent_class_id   smallint              NOT NULL,

  author_id          integer              NOT NULL,
  computer_author_id integer              NOT NULL,

  title             varchar(60)           NOT NULL,

  code              text                  DEFAULT NULL,
  ss_code           text                  DEFAULT NULL,

  created_at     timestamp with time zone NOT NULL    DEFAULT timezone('UTC'::text, now()),
  updated_at     timestamp with time zone,

  CONSTRAINT "computer_unique_idx"
    UNIQUE (parent_id, parent_class_id, class_id, file_id)

);


-- DOWN


DROP TABLE IF EXISTS computer CASCADE;





