
CREATE TABLE screen_name (
  id             serial   NOT NULL,
  type_id        smallint NOT NULL DEFAULT 0,
  owner_id       integer  NOT NULL DEFAULT 0,
  screen_name    character varying(15) NOT NULL,
  display_name   character varying(15) NOT NULL,
  nick_name      character varying(30) DEFAULT NULL::character varying,
  about          text,
  created_at     timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  trashed_at     timestamp with time zone,
  CONSTRAINT     "screen_name_pkey" PRIMARY KEY (id),
  CONSTRAINT     "screen_name_screen_name_key" UNIQUE (screen_name)
);

CREATE INDEX "screen_name_owner_id_idx"
  ON "screen_name"
  USING btree
  (owner_id, type_id);

-- DOWN


DROP TABLE IF EXISTS screen_name;
