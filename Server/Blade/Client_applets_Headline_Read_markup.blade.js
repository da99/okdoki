function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/Headline_Read/markup.blade";
    __.source = '\nappend templates\n  div.headline.msg(id="{dom_id}")\n    div.meta\n      span.name {author}\n      span.said &nbsp;said&nbsp;\n      input(type="hidden", name="author", value="{author}")\n    div.body\n      | {body}\n\n\n';
    try {
        with (__.locals) {
            __.line = 2, __.col = 1;
            __.r.blockMod("a", "templates", __, function(__) {
                __.line = 3, __.col = 3;
                __.push("<div" + ' id="{dom_id}"' + ' class="headline msg"' + ">");
                __.line = 4, __.col = 5;
                __.push("<div" + ' class="meta"' + ">");
                __.line = 5, __.col = 7;
                __.push("<span" + ' class="name"' + ">" + "{author}" + "</span>");
                __.line = 6, __.col = 7;
                __.push("<span" + ' class="said"' + ">" + "&nbsp;said&nbsp;" + "</span>");
                __.line = 7, __.col = 7;
                __.push("<input" + ' type="hidden"' + ' name="author"' + ' value="{author}"' + "/>" + "</div>");
                __.line = 8, __.col = 5;
                __.push("<div" + ' class="body"' + ">");
                __.line = 9, __.col = 7;
                __.push("{body}" + "</div>" + "</div>");
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
