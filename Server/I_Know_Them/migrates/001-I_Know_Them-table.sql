
CREATE TABLE i_know_them (
  id                     serial PRIMARY KEY,
  owner_id               integer               NOT NULL,
  target_id              integer               NOT NULL,
  is_follow              boolean               NOT NULL   DEFAULT false,
  is_block               boolean               NOT NULL   DEFAULT false,
  is_talk_able           boolean               NOT NULL   DEFAULT false,

  created_at             timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at             timestamp with time zone,
  trashed_at             timestamp with time zone
);



-- DOWN

DROP TABLE i_know_them;


