function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/Uni/markup.blade";
    __.source = 'div.box#Create_Website\n  h3 Create a new website:\n  div.content\n    form(action="/me/#{screen_name}/create/website", method="POST")\n      div.fields\n        div.field.title\n          span.label Title:\n          input(type="text", value="", name="title", maxlength="100")\n      div.buttons\n        button.submit Create\n';
    try {
        with (__.locals) {
            __.line = 1, __.col = 1;
            __.push("<div" + ' id="Create_Website"' + ' class="box"' + ">");
            __.line = 2, __.col = 3;
            __.push("<h3" + ">" + "Create a new website:" + "</h3>");
            __.line = 3, __.col = 3;
            __.push("<div" + ' class="content"' + ">");
            __.line = 4, __.col = 5;
            __.push("<form" + ' method="POST"');
            __.r.attrs({
                action: {
                    v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/create/website",
                    e: 1
                }
            }, __);
            __.push(">");
            __.line = 5, __.col = 7;
            __.push("<div" + ' class="fields"' + ">");
            __.line = 6, __.col = 9;
            __.push("<div" + ' class="field title"' + ">");
            __.line = 7, __.col = 11;
            __.push("<span" + ' class="label"' + ">" + "Title:" + "</span>");
            __.line = 8, __.col = 11;
            __.push("<input" + ' type="text"' + ' name="title"' + ' maxlength="100"');
            __.r.attrs({
                value: {
                    v: undefined,
                    e: 1
                }
            }, __);
            __.push("/>" + "</div>" + "</div>");
            __.line = 9, __.col = 7;
            __.push("<div" + ' class="buttons"' + ">");
            __.line = 10, __.col = 9;
            __.push("<button" + ' class="submit"' + ">" + "Create" + "</button>" + "</div>" + "</form>" + "</div>" + "</div>");
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
