
var table = 'Chat_Room_Msg';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE UNLOGGED TABLE      "' + table + '" (             \n\
    id              serial PRIMARY KEY,                                 \n\
    is_official     BOOLEAN DEFAULT false,                              \n\
    is_error        BOOLEAN DEFAULT false,                              \n\
    chat_room       varchar(50) NOT NULL,                               \n\
    author          varchar(50) NOT NULL,                               \n\
    body            text,                                               \n\
    $created_at                                                         \n\
    );';
    r.create(sql, "CREATE INDEX ON \"" + table + "\" (chat_room, created_at) ");

  }
};
