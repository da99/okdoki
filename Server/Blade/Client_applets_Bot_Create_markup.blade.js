function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/Bot_Create/markup.blade";
    __.source = '\nappend Bot_Create\n\n  - var has_bots = (Bots.Own.length) ? \'has_bots\' : \'\'\n  div.box#New_Bot(class="#{has_bots}")\n    div.setting\n      a.on(href="#show") Show\n    h3 Create a Bot\n    div.content\n      div.list\n        - for(var x in Bots.Own)\n          - var name = Bots.Own[x].screen_name\n          a>(href="/bot/#{name}") #{name}\n      - if (Bots.Own.length)\n      form#Bot_Create(action="/Bot", method="POST")\n        div.fields\n          div.field.sub_sn\n            label(for="NEW_BOT_SCREEN_NAME") Screen Name:\n            input#NEW_BOT_SCREEN_NAME(name="sub_sn", type="text")\n        div.buttons\n          call span_as()\n          button.submit Create\n';
    try {
        with (__.locals) {
            __.line = 2, __.col = 1;
            __.r.blockMod("a", "Bot_Create", __, function(__) {
                __.line = 4, __.col = 3;
                var has_bots = Bots.Own.length ? "has_bots" : "";
                __.line = 5, __.col = 3;
                __.push("<div" + ' id="New_Bot"');
                __.r.attrs({
                    "class": {
                        v: "" + __.r.escape((__.z = has_bots) == null ? "" : __.z) + " box",
                        e: 1
                    }
                }, __);
                __.push(">");
                __.line = 6, __.col = 5;
                __.push("<div" + ' class="setting"' + ">");
                __.line = 7, __.col = 7;
                __.push("<a" + ' href="#show"' + ' class="on"' + ">" + "Show" + "</a>" + "</div>");
                __.line = 8, __.col = 5;
                __.push("<h3" + ">" + "Create a Bot" + "</h3>");
                __.line = 9, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 10, __.col = 7;
                __.push("<div" + ' class="list"' + ">");
                __.line = 11, __.col = 9;
                for (var x in Bots.Own) {
                    __.line = 12, __.col = 11;
                    var name = Bots.Own[x].screen_name;
                    __.line = 13, __.col = 11;
                    __.push("<a");
                    __.r.attrs({
                        href: {
                            v: "/bot/" + __.r.escape((__.z = name) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push(">" + __.r.escape("" + __.r.escape((__.z = name) == null ? "" : __.z) + "") + "</a>" + " ");
                }
                __.push("</div>");
                __.line = 14, __.col = 7;
                if (Bots.Own.length) ;
                __.line = 15, __.col = 7;
                __.push("<form" + ' action="/Bot"' + ' method="POST"' + ' id="Bot_Create"' + ">");
                __.line = 16, __.col = 9;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 17, __.col = 11;
                __.push("<div" + ' class="field sub_sn"' + ">");
                __.line = 18, __.col = 13;
                __.push("<label" + ' for="NEW_BOT_SCREEN_NAME"' + ">" + "Screen Name:" + "</label>");
                __.line = 19, __.col = 13;
                __.push("<input" + ' name="sub_sn"' + ' type="text"' + ' id="NEW_BOT_SCREEN_NAME"' + "/>" + "</div>" + "</div>");
                __.line = 20, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 21, __.col = 11;
                __.r.call("span_as", {}, __);
                __.line = 22, __.col = 11;
                __.push("<button" + ' class="submit"' + ">" + "Create" + "</button>" + "</div>" + "</form>" + "</div>" + "</div>");
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
