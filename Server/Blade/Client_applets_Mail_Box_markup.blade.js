function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/Mail_Box/markup.blade";
    __.source = 'append Session_Nav\n  a.urgent(href="#urgent")\n    span.number 0\n    span.body  Urgent\n  a.im_bored(href="#i_am_bored")\n    span.number 0\n    span.body  I\'m Bored\n  a.good_news(href="#good")\n    span.number 0\n    span.body  Good News\n  a.bad_news(href="#bad")\n    span.number 0\n    span.body  Bad News\n  a.other(href="#other")\n    span.number 0\n    span.body  Other Mail\n';
    try {
        with (__.locals) {
            __.line = 1, __.col = 1;
            __.r.blockMod("a", "Session_Nav", __, function(__) {
                __.line = 2, __.col = 3;
                __.push("<a" + ' href="#urgent"' + ' class="urgent"' + ">");
                __.line = 3, __.col = 5;
                __.push("<span" + ' class="number"' + ">" + "0" + "</span>");
                __.line = 4, __.col = 5;
                __.push("<span" + ' class="body"' + ">" + " Urgent" + "</span>" + "</a>");
                __.line = 5, __.col = 3;
                __.push("<a" + ' href="#i_am_bored"' + ' class="im_bored"' + ">");
                __.line = 6, __.col = 5;
                __.push("<span" + ' class="number"' + ">" + "0" + "</span>");
                __.line = 7, __.col = 5;
                __.push("<span" + ' class="body"' + ">" + " I'm Bored" + "</span>" + "</a>");
                __.line = 8, __.col = 3;
                __.push("<a" + ' href="#good"' + ' class="good_news"' + ">");
                __.line = 9, __.col = 5;
                __.push("<span" + ' class="number"' + ">" + "0" + "</span>");
                __.line = 10, __.col = 5;
                __.push("<span" + ' class="body"' + ">" + " Good News" + "</span>" + "</a>");
                __.line = 11, __.col = 3;
                __.push("<a" + ' href="#bad"' + ' class="bad_news"' + ">");
                __.line = 12, __.col = 5;
                __.push("<span" + ' class="number"' + ">" + "0" + "</span>");
                __.line = 13, __.col = 5;
                __.push("<span" + ' class="body"' + ">" + " Bad News" + "</span>" + "</a>");
                __.line = 14, __.col = 3;
                __.push("<a" + ' href="#other"' + ' class="other"' + ">");
                __.line = 15, __.col = 5;
                __.push("<span" + ' class="number"' + ">" + "0" + "</span>");
                __.line = 16, __.col = 5;
                __.push("<span" + ' class="body"' + ">" + " Other Mail" + "</span>" + "</a>");
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
