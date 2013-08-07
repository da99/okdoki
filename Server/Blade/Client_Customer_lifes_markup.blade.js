function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.base = "/home/da/DEV/apps/okdoki";
    __.rel = "Client/Customer/lifes";
    __.filename = "/home/da/DEV/apps/okdoki/Client/Customer/lifes/markup.blade";
    __.source = "\n\ninclude \"../../layout.blade\"\n\n- if (customer_has_one_life)\n  - var S = '';\n- else\n  - var S = 's';\n\n\n\nappend templates\n  li.screen_name\n    a(href='/me/{name}')\n      | {name}\n\nappend content\n\n  //- ===========================================================\n  div#Logo\n    span.main\n      | ok\n    span.sub\n      | doki\n    span.wat_wat\n      | :&nbsp;Multi-Life Chat & Publishing\n\n  //- ===========================================================\n  div.col#Interact\n\n    block Message_Create\n    block Create_Life\n\n    div#Options\n      h2 Options for Eggheads\n      block Bot_Create\n\n\n\n  //- ===========================================================\n  div.col#Msgs\n    div#Headlines\n\n\ncall applet(\"Create_Life\")\ncall applet(\"Bot_Create\")\n\n\n\n\n\n";
    try {
        with (__.locals) {
            __.line = 3, __.col = 1;
            __.r.include("../../layout.blade", __);
            __.line = 5, __.col = 1;
            if (customer_has_one_life) {
                __.line = 6, __.col = 3;
                var S = "";
            } else {
                var S = "s";
            }
            __.line = 12, __.col = 1;
            __.r.blockMod("a", "templates", __, function(__) {
                __.line = 13, __.col = 3;
                __.push("<li" + ' class="screen_name"' + ">");
                __.line = 14, __.col = 5;
                __.push("<a" + ' href="/me/{name}"' + ">");
                __.line = 15, __.col = 7;
                __.push("{name}" + "</a>" + "</li>");
            });
            __.line = 17, __.col = 1;
            __.r.blockMod("a", "content", __, function(__) {
                __.line = 19, __.col = 3;
                __.line = 20, __.col = 3;
                __.push("<div" + ' id="Logo"' + ">");
                __.line = 21, __.col = 5;
                __.push("<span" + ' class="main"' + ">");
                __.line = 22, __.col = 7;
                __.push("ok" + "</span>");
                __.line = 23, __.col = 5;
                __.push("<span" + ' class="sub"' + ">");
                __.line = 24, __.col = 7;
                __.push("doki" + "</span>");
                __.line = 25, __.col = 5;
                __.push("<span" + ' class="wat_wat"' + ">");
                __.line = 26, __.col = 7;
                __.push(":&nbsp;Multi-Life Chat &amp; Publishing" + "</span>" + "</div>");
                __.line = 28, __.col = 3;
                __.line = 29, __.col = 3;
                __.push("<div" + ' id="Interact"' + ' class="col"' + ">");
                __.line = 31, __.col = 5;
                __.r.blockDef("Message_Create", __, function(__) {});
                __.line = 32, __.col = 5;
                __.r.blockDef("Create_Life", __, function(__) {});
                __.line = 34, __.col = 5;
                __.push("<div" + ' id="Options"' + ">");
                __.line = 35, __.col = 7;
                __.push("<h2" + ">" + "Options for Eggheads" + "</h2>");
                __.line = 36, __.col = 7;
                __.r.blockDef("Bot_Create", __, function(__) {});
                __.push("</div>" + "</div>");
                __.line = 40, __.col = 3;
                __.line = 41, __.col = 3;
                __.push("<div" + ' id="Msgs"' + ' class="col"' + ">");
                __.line = 42, __.col = 5;
                __.push("<div" + ' id="Headlines"' + ">" + "</div>" + "</div>");
            });
            __.line = 45, __.col = 1;
            __.r.call("applet", {}, __, "Create_Life");
            __.line = 46, __.col = 1;
            __.r.call("applet", {}, __, "Bot_Create");
        }
    } catch (e) {
        return cb(__.r.rethrow(e, __));
    }
    if (!__.inc) __.r.done(__);
    __.bd = 1;
    cb(null, __.join(""), __);
}
var runtime = require('./runtime');
var blade = runtime.blade;
exports.render = anonymous;
