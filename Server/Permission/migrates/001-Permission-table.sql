
CREATE TABLE permission (
  id             SERIAL       NOT NULL,

  from_id        integer      NOT NULL,
  pub_type_id    smallint     NOT NULL,
  pub_id         integer      NOT NULL,
  to_id          integer      NOT NULL
);

CREATE UNIQUE INDEX permission_unique_idx ON permission (author_id, pub_type_id, pub_id, reader_id);

-- DOWN

DROP TABLE IF EXISTS permission CASCADE;


