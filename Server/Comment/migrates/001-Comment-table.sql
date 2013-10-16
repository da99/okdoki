
CREATE TABLE comment (
  id                SERIAL PRIMARY KEY,

  pub_type_id       smallint                 NOT NULL,
  pub_id            int                      NOT NULL,
  author_id         int                      NOT NULL,
  body              text                     NOT NULL,

  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now())
);

CREATE INDEX comment_read_by_pub_and_author_idx  ON  comment  ( pub_type_id, pub_id, author_id );


-- DOWN

DROP TABLE IF EXISTS comment CASCADE;


