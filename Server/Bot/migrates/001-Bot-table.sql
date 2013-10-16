
CREATE TABLE bot (
  id                   integer                  PRIMARY KEY,
  created_at           timestamp with time zone NOT NULL DEFAULT timezone('UTC'::text, now()),
  updated_at           timestamp with time zone
);



-- DOWN


DROP TABLE IF EXISTS bot;





