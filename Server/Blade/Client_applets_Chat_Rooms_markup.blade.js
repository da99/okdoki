function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/Chat_Rooms/markup.blade";
    __.source = '\nfunction Chat_Room_room_out(chr_sn, o_sn)\n  div.room.out\n    a.enter(href="#enter-#{chr_sn}") Enter\n    span.chat_room.name #{chr_sn}\n    input(type="hidden", name="chat_room", value="#{chr_sn}")\n    input(type="hidden", name="owner", value="#{o_sn}")\n\nfunction Chat_Room_room_in(chr_sn, o_sn)\n  div.room.in\n    //- a.leave(href="#leave") X\n      //- span.name The Digital Word\n    a.leave(href="#leave-#{chr_sn}") X\n    span.chat_room.name #{chr_sn}\n    input(type="hidden", name="chat_room", value="#{chr_sn}")\n    input(type="hidden", name="owner", value="#{o_sn}")\n\nappend templates\n  div#Chat_Rooms\n    call Chat_Room_room_in("{chat_room}", "{owner}")\n    call Chat_Room_room_out("{chat_room}", "{owner}")\n\n\nappend Chat_Rooms_List\n  div.box#Rooms\n    div#In_Rooms\n      h3 Rooms You\'re In:\n      div.rooms\n        //- - for (var i in chat_room_ins)\n          //- call Chat_Room_room_in(chat_room_ins[i].chat_room, chat_room_ins[i].owner)\n        //- div.chatters\n          //- a.show(href="#list") Show Chatters\n        //- div.room\n          //- a.leave(href="#leave") X\n          //- span.name The Digital Word\n          //- div.chatters\n            //- ul.list\n              //- li Tom\n              //- li.out Dick\n              //- li Harry\n            //- a.hide(href="#hide_list") Hide Chatters\n        //- div.room\n          //- a.leave(href="#leave") X\n          //- span.name Super Nerds\n          //- div.chatters\n            //- ul.list\n              //- li Tom\n              //- li.out Dick\n              //- li Harry\n            //- a.hide(href="#hide_list") Hide Chatters\n\n    div#Out_Rooms\n      h3 You\'re out of:\n      div.rooms\n        - for (var i in chat_room_seats)\n          call Chat_Room_room_out(chat_room_seats[i].chat_room, chat_room_seats[i].owner)\n\nappend Chat_Rooms_Enter\n  div.box#Enter_Room\n    h3 Enter A Room By Screen Name:\n    div.content\n      form#Create_Chat_Room_Seat(action="/chat_room/seat", method="POST")\n        div.fields\n          div.field.screen_name\n            input(type="text", value="", name="chat_room", maxlength="50")\n        div.buttons\n          call span_as()\n          button.submit Enter\n\n\n\n\n\n\n\n\n\n\n\n';
    try {
        with (__.locals) {
            __.line = 2, __.col = 1;
            __.r.func("Chat_Room_room_out", function(__, chr_sn, o_sn) {
                __.line = 3, __.col = 3;
                __.push("<div");
                __.r.attrs({
                    id: {
                        v: this.id
                    },
                    "class": {
                        v: this.classes,
                        a: "room out"
                    }
                }, __);
                __.push(">");
                __.line = 4, __.col = 5;
                __.push("<a" + ' class="enter"');
                __.r.attrs({
                    href: {
                        v: "#enter-" + __.r.escape((__.z = chr_sn) == null ? "" : __.z) + "",
                        e: 1
                    }
                }, __);
                __.push(">" + "Enter" + "</a>");
                __.line = 5, __.col = 5;
                __.push("<span" + ' class="chat_room name"' + ">" + __.r.escape("" + __.r.escape((__.z = chr_sn) == null ? "" : __.z) + "") + "</span>");
                __.line = 6, __.col = 5;
                __.push("<input" + ' type="hidden"' + ' name="chat_room"');
                __.r.attrs({
                    value: {
                        v: "" + __.r.escape((__.z = chr_sn) == null ? "" : __.z) + "",
                        e: 1
                    }
                }, __);
                __.push("/>");
                __.line = 7, __.col = 5;
                __.push("<input" + ' type="hidden"' + ' name="owner"');
                __.r.attrs({
                    value: {
                        v: "" + __.r.escape((__.z = o_sn) == null ? "" : __.z) + "",
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>");
            }, __);
            __.line = 9, __.col = 1;
            __.r.func("Chat_Room_room_in", function(__, chr_sn, o_sn) {
                __.line = 10, __.col = 3;
                __.push("<div");
                __.r.attrs({
                    id: {
                        v: this.id
                    },
                    "class": {
                        v: this.classes,
                        a: "room in"
                    }
                }, __);
                __.push(">");
                __.line = 11, __.col = 5;
                __.line = 13, __.col = 5;
                __.push("<a" + ' class="leave"');
                __.r.attrs({
                    href: {
                        v: "#leave-" + __.r.escape((__.z = chr_sn) == null ? "" : __.z) + "",
                        e: 1
                    }
                }, __);
                __.push(">" + "X" + "</a>");
                __.line = 14, __.col = 5;
                __.push("<span" + ' class="chat_room name"' + ">" + __.r.escape("" + __.r.escape((__.z = chr_sn) == null ? "" : __.z) + "") + "</span>");
                __.line = 15, __.col = 5;
                __.push("<input" + ' type="hidden"' + ' name="chat_room"');
                __.r.attrs({
                    value: {
                        v: "" + __.r.escape((__.z = chr_sn) == null ? "" : __.z) + "",
                        e: 1
                    }
                }, __);
                __.push("/>");
                __.line = 16, __.col = 5;
                __.push("<input" + ' type="hidden"' + ' name="owner"');
                __.r.attrs({
                    value: {
                        v: "" + __.r.escape((__.z = o_sn) == null ? "" : __.z) + "",
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>");
            }, __);
            __.line = 18, __.col = 1;
            __.r.blockMod("a", "templates", __, function(__) {
                __.line = 19, __.col = 3;
                __.push("<div" + ' id="Chat_Rooms"' + ">");
                __.line = 20, __.col = 5;
                __.r.call("Chat_Room_room_in", {}, __, "{chat_room}", "{owner}");
                __.line = 21, __.col = 5;
                __.r.call("Chat_Room_room_out", {}, __, "{chat_room}", "{owner}");
                __.push("</div>");
            });
            __.line = 24, __.col = 1;
            __.r.blockMod("a", "Chat_Rooms_List", __, function(__) {
                __.line = 25, __.col = 3;
                __.push("<div" + ' id="Rooms"' + ' class="box"' + ">");
                __.line = 26, __.col = 5;
                __.push("<div" + ' id="In_Rooms"' + ">");
                __.line = 27, __.col = 7;
                __.push("<h3" + ">" + "Rooms You're In:" + "</h3>");
                __.line = 28, __.col = 7;
                __.push("<div" + ' class="rooms"' + ">");
                __.line = 29, __.col = 9;
                __.line = 31, __.col = 9;
                __.line = 33, __.col = 9;
                __.line = 42, __.col = 9;
                __.push("</div>" + "</div>");
                __.line = 52, __.col = 5;
                __.push("<div" + ' id="Out_Rooms"' + ">");
                __.line = 53, __.col = 7;
                __.push("<h3" + ">" + "You're out of:" + "</h3>");
                __.line = 54, __.col = 7;
                __.push("<div" + ' class="rooms"' + ">");
                __.line = 55, __.col = 9;
                for (var i in chat_room_seats) {
                    __.line = 56, __.col = 11;
                    __.r.call("Chat_Room_room_out", {}, __, chat_room_seats[i].chat_room, chat_room_seats[i].owner);
                }
                __.push("</div>" + "</div>" + "</div>");
            });
            __.line = 58, __.col = 1;
            __.r.blockMod("a", "Chat_Rooms_Enter", __, function(__) {
                __.line = 59, __.col = 3;
                __.push("<div" + ' id="Enter_Room"' + ' class="box"' + ">");
                __.line = 60, __.col = 5;
                __.push("<h3" + ">" + "Enter A Room By Screen Name:" + "</h3>");
                __.line = 61, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 62, __.col = 7;
                __.push("<form" + ' action="/chat_room/seat"' + ' method="POST"' + ' id="Create_Chat_Room_Seat"' + ">");
                __.line = 63, __.col = 9;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 64, __.col = 11;
                __.push("<div" + ' class="field screen_name"' + ">");
                __.line = 65, __.col = 13;
                __.push("<input" + ' type="text"' + ' name="chat_room"' + ' maxlength="50"');
                __.r.attrs({
                    value: {
                        v: undefined,
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>" + "</div>");
                __.line = 66, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 67, __.col = 11;
                __.r.call("span_as", {}, __);
                __.line = 68, __.col = 11;
                __.push("<button" + ' class="submit"' + ">" + "Enter" + "</button>" + "</div>" + "</form>" + "</div>" + "</div>");
            });
        }
    } catch (e) {
        return cb(__.r.rethrow(e, __));
    }
    if (!__.inc) __.r.done(__);
    cb(null, __.join(""), __);
}
var runtime = require('./runtime');
var blade = runtime.blade;
exports.render = anonymous;
