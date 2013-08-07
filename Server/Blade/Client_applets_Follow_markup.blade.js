function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/Follow/markup.blade";
    __.source = '- if (is_customer && !is_owner)\n  div.box#Follow(class="#{is_following && \'is_following\'}")\n    div.content\n      form#Delete_Follow(action="/me/#{screen_name}/follow", method="POST")\n        div.buttons\n          div.intro\n            | You\'re subscribed.\n          input(type="hidden", name="_method", value="DELETE")\n          button.submit Unsubscribe\n      form#Create_Follow(action="/me/#{screen_name}/follow", method="POST")\n        call applet(\'as_this_life\')\n        div.buttons\n          button.submit Subscribe\n\n';
    try {
        with (__.locals) {
            __.line = 1, __.col = 1;
            if (is_customer && !is_owner) {
                __.line = 2, __.col = 3;
                __.push("<div" + ' id="Follow"');
                __.r.attrs({
                    "class": {
                        v: "" + __.r.escape((__.z = is_following && "is_following") == null ? "" : __.z) + " box",
                        e: 1
                    }
                }, __);
                __.push(">");
                __.line = 3, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 4, __.col = 7;
                __.push("<form" + ' method="POST"' + ' id="Delete_Follow"');
                __.r.attrs({
                    action: {
                        v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/follow",
                        e: 1
                    }
                }, __);
                __.push(">");
                __.line = 5, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 6, __.col = 11;
                __.push("<div" + ' class="intro"' + ">");
                __.line = 7, __.col = 13;
                __.push("You're subscribed." + "</div>");
                __.line = 8, __.col = 11;
                __.push("<input" + ' type="hidden"' + ' name="_method"' + ' value="DELETE"' + "/>");
                __.line = 9, __.col = 11;
                __.push("<button" + ' class="submit"' + ">" + "Unsubscribe" + "</button>" + "</div>" + "</form>");
                __.line = 10, __.col = 7;
                __.push("<form" + ' method="POST"' + ' id="Create_Follow"');
                __.r.attrs({
                    action: {
                        v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/follow",
                        e: 1
                    }
                }, __);
                __.push(">");
                __.line = 11, __.col = 9;
                __.r.call("applet", {}, __, "as_this_life");
                __.line = 12, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 13, __.col = 11;
                __.push("<button" + ' class="submit"' + ">" + "Subscribe" + "</button>" + "</div>" + "</form>" + "</div>" + "</div>");
            }
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
