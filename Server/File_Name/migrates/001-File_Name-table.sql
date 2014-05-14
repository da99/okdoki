
CREATE TABLE file_name (

  id SERIAL PRIMARY KEY,
  file_name varchar(15) NOT NULL,

  CONSTRAINT "file_name_unique_idx"
    UNIQUE (file_name)
);



-- DOWN

DROP TABLE IF EXISTS file_name CASCADE;


