function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/Headline_Create/markup.blade";
    __.source = '\nappend Message_Create\n  div.box#New_Message\n    h3 Write to your message board:\n    div.content\n      form#Headline_Create(action="/Headline", method="post")\n        div.fields\n          div.field.body\n            span.label Type your message:\n            textarea(name="body")\n        div.buttons\n          call span_as()\n          button.submit Send.\n\n\n';
    try {
        with (__.locals) {
            __.line = 2, __.col = 1;
            __.r.blockMod("a", "Message_Create", __, function(__) {
                __.line = 3, __.col = 3;
                __.push("<div" + ' id="New_Message"' + ' class="box"' + ">");
                __.line = 4, __.col = 5;
                __.push("<h3" + ">" + "Write to your message board:" + "</h3>");
                __.line = 5, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 6, __.col = 7;
                __.push("<form" + ' action="/Headline"' + ' method="post"' + ' id="Headline_Create"' + ">");
                __.line = 7, __.col = 9;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 8, __.col = 11;
                __.push("<div" + ' class="field body"' + ">");
                __.line = 9, __.col = 13;
                __.push("<span" + ' class="label"' + ">" + "Type your message:" + "</span>");
                __.line = 10, __.col = 13;
                __.push("<textarea" + ' name="body"' + ">" + "</textarea>" + "</div>" + "</div>");
                __.line = 11, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 12, __.col = 11;
                __.r.call("span_as", {}, __);
                __.line = 13, __.col = 11;
                __.push("<button" + ' class="submit"' + ">" + "Send." + "</button>" + "</div>" + "</form>" + "</div>" + "</div>");
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
