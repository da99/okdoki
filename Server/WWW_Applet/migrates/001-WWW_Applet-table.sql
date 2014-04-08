

CREATE TABLE IF NOT EXISTS www_applet (
    id             serial PRIMARY KEY,
    link           text NOT NULL,
    screen_name    varchar(25) NOT NULL,
    owner_id       int NOT NULL,
    title          varchar(100) NOT NULL,
    bio            text NOT NULL,
    $created_at    ,
    $updated_at    ,
    $trashed_at    ,
    CONSTRAINT     "www_applet_screen_name_owner_id"
    UNIQUE (screen_name, owner_id)
);

-- DOWN

DROP TABLE IF EXISTS www_applet



