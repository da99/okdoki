function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/WWW_Applet_Create/markup.blade";
    __.source = '\n\n\n\nappend WwW_Applet_Create\n\n  div.box\n    div.setting\n      a.on(href="#show") Show\n      a.off(href="#off") Hide\n    h3 Publish a WWW applet\n    div.content\n      form#Create_WWW_Applet(action="/applet", method="POST")\n        div.fields\n          div.field.url\n            label(for="NEW_APPLET_URL") URL:\n            input#NEW_APPLET_URL(type="text", value="")\n          div.field.screen_name\n            label(for="NEW_APPLET_SN") Screen Name:\n            input#NEW_APPLET_SN(type="text", value="", maxlength="25")\n          div.field.title\n            label(for="NEW_APPLET_TITLE") TITLE:\n            input#NEW_APPLET_TITLE(type="text", value="", maxlength="80")\n          div.field.desc\n            label(for="NEW_APPLET_DESC") Brief Description:\n            textarea#NEW_APPLET_DESC\n        div.buttons\n          call span_as()\n          button.submit Create\n\n\n';
    try {
        with (__.locals) {
            __.line = 5, __.col = 1;
            __.r.blockMod("a", "WwW_Applet_Create", __, function(__) {
                __.line = 7, __.col = 3;
                __.push("<div" + ' class="box"' + ">");
                __.line = 8, __.col = 5;
                __.push("<div" + ' class="setting"' + ">");
                __.line = 9, __.col = 7;
                __.push("<a" + ' href="#show"' + ' class="on"' + ">" + "Show" + "</a>");
                __.line = 10, __.col = 7;
                __.push("<a" + ' href="#off"' + ' class="off"' + ">" + "Hide" + "</a>" + "</div>");
                __.line = 11, __.col = 5;
                __.push("<h3" + ">" + "Publish a WWW applet" + "</h3>");
                __.line = 12, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 13, __.col = 7;
                __.push("<form" + ' action="/applet"' + ' method="POST"' + ' id="Create_WWW_Applet"' + ">");
                __.line = 14, __.col = 9;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 15, __.col = 11;
                __.push("<div" + ' class="field url"' + ">");
                __.line = 16, __.col = 13;
                __.push("<label" + ' for="NEW_APPLET_URL"' + ">" + "URL:" + "</label>");
                __.line = 17, __.col = 13;
                __.push("<input" + ' type="text"' + ' id="NEW_APPLET_URL"');
                __.r.attrs({
                    value: {
                        v: undefined,
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>");
                __.line = 18, __.col = 11;
                __.push("<div" + ' class="field screen_name"' + ">");
                __.line = 19, __.col = 13;
                __.push("<label" + ' for="NEW_APPLET_SN"' + ">" + "Screen Name:" + "</label>");
                __.line = 20, __.col = 13;
                __.push("<input" + ' type="text"' + ' maxlength="25"' + ' id="NEW_APPLET_SN"');
                __.r.attrs({
                    value: {
                        v: undefined,
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>");
                __.line = 21, __.col = 11;
                __.push("<div" + ' class="field title"' + ">");
                __.line = 22, __.col = 13;
                __.push("<label" + ' for="NEW_APPLET_TITLE"' + ">" + "TITLE:" + "</label>");
                __.line = 23, __.col = 13;
                __.push("<input" + ' type="text"' + ' maxlength="80"' + ' id="NEW_APPLET_TITLE"');
                __.r.attrs({
                    value: {
                        v: undefined,
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>");
                __.line = 24, __.col = 11;
                __.push("<div" + ' class="field desc"' + ">");
                __.line = 25, __.col = 13;
                __.push("<label" + ' for="NEW_APPLET_DESC"' + ">" + "Brief Description:" + "</label>");
                __.line = 26, __.col = 13;
                __.push("<textarea" + ' id="NEW_APPLET_DESC"' + ">" + "</textarea>" + "</div>" + "</div>");
                __.line = 27, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 28, __.col = 11;
                __.r.call("span_as", {}, __);
                __.line = 29, __.col = 11;
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
