
CREATE TABLE i_know_them (
  id                     serial PRIMARY KEY,
  owner_id               integer               NOT NULL,
  target_id              integer               NOT NULL,
  is_follow              boolean               NOT NULL   DEFAULT false,
  is_block               boolean               NOT NULL   DEFAULT false,
  is_talk_able           boolean               NOT NULL   DEFAULT false,

  created_at             timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at             timestamp with time zone,
  trashed_at             timestamp with time zone,

  CONSTRAINT             "i_know_them_owner" UNIQUE (owner_id, target_id)
);



-- DOWN

DROP TABLE i_know_them CASCADE;


