function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/Error/error.blade";
    __.source = "!!! 5\nhtml(lang='en')\n\n  head\n    title #{msg}\n    meta(http-equiv=\"Content-Type\", content=\"text/html charet=UTF-8\" )\n    meta(http-equiv=\"Cache-Control\", content=\"no-cache, max-age=0, must-revalidate, no-store, max-stale=0, post-check=0, pre-check=0\" )\n\n    link(rel='shortcut icon', href='/favicon.ico')\n    link(href=\"/Error/style.css\", rel='stylesheet', media='screen', type=\"text/css\")\n\n  body\n    - var pieces = msg.split(':')\n    - var main = pieces.shift()\n    - var rest = (pieces.length) ? pieces.join(':') : null\n    div#Message\n      div.main #{main}\n      - if (rest)\n        div.rest #{rest}\n\n\n\n";
    try {
        with (__.locals) {
            __.push("<!DOCTYPE html>");
            __.line = 2, __.col = 1;
            __.push("<html" + ' lang="en"' + ">");
            __.line = 4, __.col = 3;
            __.push("<head" + ">");
            __.line = 5, __.col = 5;
            __.push("<title" + ">" + __.r.escape("" + __.r.escape((__.z = msg) == null ? "" : __.z) + "") + "</title>");
            __.line = 6, __.col = 5;
            __.push("<meta" + ' http-equiv="Content-Type"' + ' content="text/html charet=UTF-8"' + "/>");
            __.line = 7, __.col = 5;
            __.push("<meta" + ' http-equiv="Cache-Control"' + ' content="no-cache, max-age=0, must-revalidate, no-store, max-stale=0, post-check=0, pre-check=0"' + "/>");
            __.line = 9, __.col = 5;
            __.push("<link" + ' rel="shortcut icon"' + ' href="/favicon.ico"' + "/>");
            __.line = 10, __.col = 5;
            __.push("<link" + ' href="/Error/style.css"' + ' rel="stylesheet"' + ' media="screen"' + ' type="text/css"' + "/>" + "</head>");
            __.line = 12, __.col = 3;
            __.push("<body" + ">");
            __.line = 13, __.col = 5;
            var pieces = msg.split(":");
            __.line = 14, __.col = 5;
            var main = pieces.shift();
            __.line = 15, __.col = 5;
            var rest = pieces.length ? pieces.join(":") : null;
            __.line = 16, __.col = 5;
            __.push("<div" + ' id="Message"' + ">");
            __.line = 17, __.col = 7;
            __.push("<div" + ' class="main"' + ">" + __.r.escape("" + __.r.escape((__.z = main) == null ? "" : __.z) + "") + "</div>");
            __.line = 18, __.col = 7;
            if (rest) {
                __.line = 19, __.col = 9;
                __.push("<div" + ' class="rest"' + ">" + __.r.escape("" + __.r.escape((__.z = rest) == null ? "" : __.z) + "") + "</div>");
            }
            __.push("</div>" + "</body>" + "</html>");
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
