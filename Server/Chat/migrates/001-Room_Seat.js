
var table = 'Chat_Room_Seat';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE UNLOGGED TABLE "' + table + '" (       \n\
    chat_room             varchar(100) NOT NULL,                  \n\
    owner                 varchar(100) NOT NULL,                  \n\
    created_at            $now_tz,                                \n\
    $trashed_at,                                                  \n\
    last_seen_at          $now_tz,                                \n\
    is_empty              boolean DEFAULT true                    \n\
    );';
    r.create(sql,
             "ALTER TABLE  \"" + table + "\" ADD CONSTRAINT \"" + table + "_seat\" UNIQUE (chat_room, owner);",
             "CREATE INDEX \"" + table + "_owner\" ON \"" + table + "\" ( owner );"
            );

  }
};
