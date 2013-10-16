

CREATE TABLE  follow (
  id                SERIAL PRIMARY KEY,

  pub_type_id       smallint    NOT NULL,
  pub_id            int         NOT NULL,
  follower_id       int         NOT NULL,

  last_read_at      timestamp with time zone,
  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now())
);

CREATE UNIQUE INDEX follow_unique_idx ON follow ( pub_type_id, pub_id, follower_id );

-- DOWN


DROP TABLE follow CASCADE;
