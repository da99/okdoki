
var table = 'Chat_Msg';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE UNLOGGED TABLE      "' + table + '" (                             \n\
    id                serial PRIMARY KEY,                                               \n\
    chat_room_id      int,                                                              \n\
    author_id         int,                                                              \n\
    body              text,                                                             \n\
    $created_at                                                                         \n\
    );';
    r.create(sql, "CREATE INDEX ON \"" + table + "\" (chat_room_id, created_at) ");

  }
};
