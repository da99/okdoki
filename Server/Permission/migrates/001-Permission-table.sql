
CREATE TABLE permission (
  id             SERIAL       NOT NULL,

  pub_type_id    smallint     NOT NULL,
  pub_id         int          NOT NULL,
  reader_id      int          NOT NULL
);

CREATE UNIQUE INDEX permission_unique_idx ON permission (type_id, target_id, reader_id);

-- DOWN

DROP TABLE IF EXISTS permission CASCADE;


