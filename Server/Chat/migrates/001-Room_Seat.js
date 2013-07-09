
var table = 'Chat_Seat';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE UNLOGGED TABLE      "' + table + '" (       \n\
    chat_room_screen_name varchar(100) NOT NULL,                  \n\
    owner_screen_name     varchar(100) NOT NULL,                  \n\
    last_seen_at          $now_tz                                 \n\
    );';
    r.create(sql,
             "ALTER TABLE  \"" + table + "\" ADD CONSTRAINT \"" + table + "_seat\" UNIQUE (chat_room_screen_name, owner_screen_name) "
            );

  }
};
