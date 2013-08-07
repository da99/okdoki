function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/WWW_Applet_Sub/markup.blade";
    __.source = '\nappend WWW_Applet_Sub\n\n  div.box\n    h3 Subscribe to a WWW applet:\n    div.content\n      form#Create_WWW_Applet_Sub(action="/applet", method="POST")\n        div.fields\n          div.field.url\n            label(for="NEW_APPLET_SUB") Screen Name of Applet:\n            input#NEW_APPLET_SUB(type="text", value="", maxlength="40")\n        div.buttons\n          button.submit Create\n';
    try {
        with (__.locals) {
            __.line = 2, __.col = 1;
            __.r.blockMod("a", "WWW_Applet_Sub", __, function(__) {
                __.line = 4, __.col = 3;
                __.push("<div" + ' class="box"' + ">");
                __.line = 5, __.col = 5;
                __.push("<h3" + ">" + "Subscribe to a WWW applet:" + "</h3>");
                __.line = 6, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 7, __.col = 7;
                __.push("<form" + ' action="/applet"' + ' method="POST"' + ' id="Create_WWW_Applet_Sub"' + ">");
                __.line = 8, __.col = 9;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 9, __.col = 11;
                __.push("<div" + ' class="field url"' + ">");
                __.line = 10, __.col = 13;
                __.push("<label" + ' for="NEW_APPLET_SUB"' + ">" + "Screen Name of Applet:" + "</label>");
                __.line = 11, __.col = 13;
                __.push("<input" + ' type="text"' + ' maxlength="40"' + ' id="NEW_APPLET_SUB"');
                __.r.attrs({
                    value: {
                        v: undefined,
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>" + "</div>");
                __.line = 12, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 13, __.col = 11;
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
