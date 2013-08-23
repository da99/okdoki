

CREATE TABLE screen_name_sub (
  id             serial PRIMARY KEY,
  type_id        smallint DEFAULT 0 NOT NULL,
  sub_sn         varchar(20)        NOT NULL,
  owner_id       int                NOT NULL references screen_name(id),
  created_at     timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at     timestamp with time zone     DEFAULT NULL,
  trashed_at     timestamp with time zone     DEFAULT NULL,
  CONSTRAINT     "screen_name_sub_owner_id_sub_sn" UNIQUE (owner_id, sub_sn)
);

-- DOWN


DROP TABLE screen_name_sub;
