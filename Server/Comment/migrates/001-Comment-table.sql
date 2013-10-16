
CREATE TABLE comment (
  id                SERIAL PRIMARY KEY,

  pub_type_id       smallint                 NOT NULL,
  pub_id            int                      NOT NULL,
  author_id         int                      NOT NULL,
  body              text                     NOT NULL,

  created_at        timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now())
);



-- DOWN

DROP TABLE IF EXISTS comment;


