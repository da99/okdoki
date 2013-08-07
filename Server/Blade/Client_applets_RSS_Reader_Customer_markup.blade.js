function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/RSS_Reader_Customer/markup.blade";
    __.source = '\n\nappend Creates\n  div.box\n    div.setting\n      a.on(href="#show") Show\n      a.off(href="#hide") Hide\n    h3 Subscribe to a RSS Feed\n    div.content\n      form#Create_RSS_Sub(action="/rss/sub", method="POST")\n        div.fields\n          div.field.url\n            label(for="NEW_RSS_SUB_URL") URL:\n            input#NEW_RSS_SUB_URL(type="text", value="")\n        div.buttons\n          button.submit Subscribe\n\nappend RSS_Reader\n  div.box#New_RSS_Sub\n    h3 RSS Feeds\n    div.content\n      div.intro\n        | Subscribe to an RSS Feed.\n        | News items will be streamed to\n        | your chat window (ie left)\n        | as they arrive.\n      form#Create_RSS_Sub(action="/rss/sub", method="action")\n        div.fields\n          div.field.link\n            label Feed Address:\n            input(type="text", name="link", value="")\n        div.buttons\n          call span_as()\n          button.submit Subscribe\n';
    try {
        with (__.locals) {
            __.line = 3, __.col = 1;
            __.r.blockMod("a", "Creates", __, function(__) {
                __.line = 4, __.col = 3;
                __.push("<div" + ' class="box"' + ">");
                __.line = 5, __.col = 5;
                __.push("<div" + ' class="setting"' + ">");
                __.line = 6, __.col = 7;
                __.push("<a" + ' href="#show"' + ' class="on"' + ">" + "Show" + "</a>");
                __.line = 7, __.col = 7;
                __.push("<a" + ' href="#hide"' + ' class="off"' + ">" + "Hide" + "</a>" + "</div>");
                __.line = 8, __.col = 5;
                __.push("<h3" + ">" + "Subscribe to a RSS Feed" + "</h3>");
                __.line = 9, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 10, __.col = 7;
                __.push("<form" + ' action="/rss/sub"' + ' method="POST"' + ' id="Create_RSS_Sub"' + ">");
                __.line = 11, __.col = 9;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 12, __.col = 11;
                __.push("<div" + ' class="field url"' + ">");
                __.line = 13, __.col = 13;
                __.push("<label" + ' for="NEW_RSS_SUB_URL"' + ">" + "URL:" + "</label>");
                __.line = 14, __.col = 13;
                __.push("<input" + ' type="text"' + ' id="NEW_RSS_SUB_URL"');
                __.r.attrs({
                    value: {
                        v: undefined,
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>" + "</div>");
                __.line = 15, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 16, __.col = 11;
                __.push("<button" + ' class="submit"' + ">" + "Subscribe" + "</button>" + "</div>" + "</form>" + "</div>" + "</div>");
            });
            __.line = 18, __.col = 1;
            __.r.blockMod("a", "RSS_Reader", __, function(__) {
                __.line = 19, __.col = 3;
                __.push("<div" + ' id="New_RSS_Sub"' + ' class="box"' + ">");
                __.line = 20, __.col = 5;
                __.push("<h3" + ">" + "RSS Feeds" + "</h3>");
                __.line = 21, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 22, __.col = 7;
                __.push("<div" + ' class="intro"' + ">");
                __.line = 23, __.col = 9;
                __.push("Subscribe to an RSS Feed.");
                __.line = 24, __.col = 9;
                __.push("\nNews items will be streamed to");
                __.line = 25, __.col = 9;
                __.push("\nyour chat window (ie left)");
                __.line = 26, __.col = 9;
                __.push("\nas they arrive." + "</div>");
                __.line = 27, __.col = 7;
                __.push("<form" + ' action="/rss/sub"' + ' method="action"' + ' id="Create_RSS_Sub"' + ">");
                __.line = 28, __.col = 9;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 29, __.col = 11;
                __.push("<div" + ' class="field link"' + ">");
                __.line = 30, __.col = 13;
                __.push("<label" + ">" + "Feed Address:" + "</label>");
                __.line = 31, __.col = 13;
                __.push("<input" + ' type="text"' + ' name="link"');
                __.r.attrs({
                    value: {
                        v: undefined,
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>" + "</div>");
                __.line = 32, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 33, __.col = 11;
                __.r.call("span_as", {}, __);
                __.line = 34, __.col = 11;
                __.push("<button" + ' class="submit"' + ">" + "Subscribe" + "</button>" + "</div>" + "</form>" + "</div>" + "</div>");
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
