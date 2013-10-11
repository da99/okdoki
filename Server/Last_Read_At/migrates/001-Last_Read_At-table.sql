
CREATE TABLE last_read_at (

  id                integer                  PRIMARY KEY,

  owner_id          integer                  NOT NULL,
  pub_type_id       smallint                 NOT NULL,
  pub_id            integer                  NOT NULL,
  last_read_at      timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now())

);

-- DOWN

DROP TABLE last_read_at CASCADE;


