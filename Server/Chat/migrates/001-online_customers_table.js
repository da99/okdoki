
var table = 'Chat_Screen_Name';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE UNLOGGED TABLE      "' + table + '" (                             \n\
    chat_room_id      int,                                                              \n\
    screen_name_id    int,                                                              \n\
    last_seen_at      $now_tz                                                           \n\
    );';
    r.create(sql,
             "ALTER TABLE     \"" + table + "\" ADD CONSTRAINT \"" + table + "_seat\" UNIQUE (chat_room_id, screen_name_id) "
            );

  }
};
