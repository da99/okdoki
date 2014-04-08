
var table = 'Chat_Room_Seat';
var m     = module.exports = {};

m.migrate = function (dir, r) {

  if (dir === 'down') {

    r.drop(table);

  } else {

    var sql = 'CREATE UNLOGGED TABLE "@T" (                       \n\
    chat_room             varchar(100) NOT NULL,                  \n\
    owner_id              int NOT NULL,                           \n\
    created_at            $now_tz,                                \n\
    $trashed_at,                                                  \n\
    last_seen_at          $now_tz,                                \n\
    is_in                 boolean DEFAULT false,                  \n\
    CONSTRAINT "@T_seat" UNIQUE (chat_room, owner_id)             \n\
    );'.replace(/@T/g, table);
    r.create(sql,
             'CREATE INDEX "@T_owner" ON "@T" ( owner_id );'.replace(/@T/g, table)
            );

  }
};
