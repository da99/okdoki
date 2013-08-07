function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/Create_Life/markup.blade";
    __.source = '\n\nappend Create_Life\n  div.box#Create_Life\n    div.mini_box.my_life\n      h3 My Life(s):\n      div.content\n        ul.screen_names\n          - for (var i in customer_screen_names)\n            li\n              a(href="/me/#{customer_screen_names[i]}") #{customer_screen_names[i]}\n    div.mini_box.create_life\n      h3 Create A New Life:\n      div.content\n        form#Create_Screen_Name(action="/me", method="POST")\n          div.fields\n            div.field.screen_name\n              span.label Screen Name:\n              input(type="text", value="", name="screen_name", maxlength="40")\n            div.field.sn_type\n              input(type="checkbox", name="type_id", value="1")\n              label(for="sn_type")\n                | It\'s for a thing:\n                | website, product, event, etc.\n          div.buttons\n            button.submit Create\n\n';
    try {
        with (__.locals) {
            __.line = 3, __.col = 1;
            __.r.blockMod("a", "Create_Life", __, function(__) {
                __.line = 4, __.col = 3;
                __.push("<div" + ' id="Create_Life"' + ' class="box"' + ">");
                __.line = 5, __.col = 5;
                __.push("<div" + ' class="mini_box my_life"' + ">");
                __.line = 6, __.col = 7;
                __.push("<h3" + ">" + "My Life(s):" + "</h3>");
                __.line = 7, __.col = 7;
                __.push("<div" + ' class="content"' + ">");
                __.line = 8, __.col = 9;
                __.push("<ul" + ' class="screen_names"' + ">");
                __.line = 9, __.col = 11;
                for (var i in customer_screen_names) {
                    __.line = 10, __.col = 13;
                    __.push("<li" + ">");
                    __.line = 11, __.col = 15;
                    __.push("<a");
                    __.r.attrs({
                        href: {
                            v: "/me/" + __.r.escape((__.z = customer_screen_names[i]) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push(">" + __.r.escape("" + __.r.escape((__.z = customer_screen_names[i]) == null ? "" : __.z) + "") + "</a>" + "</li>");
                }
                __.push("</ul>" + "</div>" + "</div>");
                __.line = 12, __.col = 5;
                __.push("<div" + ' class="mini_box create_life"' + ">");
                __.line = 13, __.col = 7;
                __.push("<h3" + ">" + "Create A New Life:" + "</h3>");
                __.line = 14, __.col = 7;
                __.push("<div" + ' class="content"' + ">");
                __.line = 15, __.col = 9;
                __.push("<form" + ' action="/me"' + ' method="POST"' + ' id="Create_Screen_Name"' + ">");
                __.line = 16, __.col = 11;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 17, __.col = 13;
                __.push("<div" + ' class="field screen_name"' + ">");
                __.line = 18, __.col = 15;
                __.push("<span" + ' class="label"' + ">" + "Screen Name:" + "</span>");
                __.line = 19, __.col = 15;
                __.push("<input" + ' type="text"' + ' name="screen_name"' + ' maxlength="40"');
                __.r.attrs({
                    value: {
                        v: undefined,
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>");
                __.line = 20, __.col = 13;
                __.push("<div" + ' class="field sn_type"' + ">");
                __.line = 21, __.col = 15;
                __.push("<input" + ' type="checkbox"' + ' name="type_id"' + ' value="1"' + "/>");
                __.line = 22, __.col = 15;
                __.push("<label" + ' for="sn_type"' + ">");
                __.line = 23, __.col = 17;
                __.push("It's for a thing:");
                __.line = 24, __.col = 17;
                __.push("\nwebsite, product, event, etc." + "</label>" + "</div>" + "</div>");
                __.line = 25, __.col = 11;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 26, __.col = 13;
                __.push("<button" + ' class="submit"' + ">" + "Create" + "</button>" + "</div>" + "</form>" + "</div>" + "</div>" + "</div>");
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
