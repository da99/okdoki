

var table = "Chat_Room_Fav";
var m     = module.exports = {};

var _     = require('underscore');
var River = require('da_river').River;

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = "CREATE TABLE IF NOT EXISTS \"" + table + "\" (   \n\
    id             serial PRIMARY KEY,                          \n\
    $owner_id      ,                                            \n\
    chat_room_screen_name  varchar(25) NOT NULL,                \n\
    $created_at    ,                                            \n\
    $updated_at    ,                                            \n\
    $trashed_at                                                 \n\
    );";

    r.create(sql,
             "ALTER TABLE \"" + table + "\" ADD CONSTRAINT \"owner_id_to_chat_room_screen_name\" UNIQUE (owner_id, chat_room_screen_name)"
            );
  }
};
