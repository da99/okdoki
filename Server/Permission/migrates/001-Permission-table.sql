
CREATE TABLE permission (
  id             SERIAL       NOT NULL,

  from_id        integer      NOT NULL,
  pub_class_id   smallint     NOT NULL,
  pub_id         integer      NOT NULL,
  to_id          integer      NOT NULL
);

CREATE UNIQUE INDEX permission_unique_idx ON permission (from_id, pub_class_id, pub_id, to_id);

-- DOWN

DROP TABLE IF EXISTS permission CASCADE;


