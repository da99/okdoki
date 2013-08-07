function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/Message_Board/markup.blade";
    __.source = 'div.box#Message_Board\n  h3\n    | Message Board:\n\n  div.content\n\n    - if (is_customer)\n      //- div.show.show_write\n      //- a(href="#Write_Message") Write A New Message.\n      form#Write_Message(action="/me/#{screen_name}/message_board/msg", method="post")\n        div.fields\n          div.field\n            span.label Message:\n            textarea(name="body")\n        call applet("as_this_life")\n        div.buttons\n          button.submit Publish\n\n    div.msgs\n      div.loading Retrieving messages...\n\n';
    try {
        with (__.locals) {
            __.line = 1, __.col = 1;
            __.push("<div" + ' id="Message_Board"' + ' class="box"' + ">");
            __.line = 2, __.col = 3;
            __.push("<h3" + ">");
            __.line = 3, __.col = 5;
            __.push("Message Board:" + "</h3>");
            __.line = 5, __.col = 3;
            __.push("<div" + ' class="content"' + ">");
            __.line = 7, __.col = 5;
            if (is_customer) {
                __.line = 8, __.col = 7;
                __.line = 9, __.col = 7;
                __.line = 10, __.col = 7;
                __.push("<form" + ' method="post"' + ' id="Write_Message"');
                __.r.attrs({
                    action: {
                        v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/message_board/msg",
                        e: 1
                    }
                }, __);
                __.push(">");
                __.line = 11, __.col = 9;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 12, __.col = 11;
                __.push("<div" + ' class="field"' + ">");
                __.line = 13, __.col = 13;
                __.push("<span" + ' class="label"' + ">" + "Message:" + "</span>");
                __.line = 14, __.col = 13;
                __.push("<textarea" + ' name="body"' + ">" + "</textarea>" + "</div>" + "</div>");
                __.line = 15, __.col = 9;
                __.r.call("applet", {}, __, "as_this_life");
                __.line = 16, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 17, __.col = 11;
                __.push("<button" + ' class="submit"' + ">" + "Publish" + "</button>" + "</div>" + "</form>");
            }
            __.line = 19, __.col = 5;
            __.push("<div" + ' class="msgs"' + ">");
            __.line = 20, __.col = 7;
            __.push("<div" + ' class="loading"' + ">" + "Retrieving messages..." + "</div>" + "</div>" + "</div>" + "</div>");
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
