function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.base = "/home/da/DEV/apps/okdoki";
    __.rel = "Client/Screen_Name/me";
    __.filename = "/home/da/DEV/apps/okdoki/Client/Screen_Name/me/markup.blade";
    __.source = 'include "../../layout.blade"\n\nfunction folder(f)\n  li.folder\n    a.open(href="/me/#{screen_name}/folder/#{f.num}") #{f.title}\n\nappend templates\n  - if (is_customer)\n    div.customer_screen_names\n      | #{customer_screen_names.join(" ")}\n  call folder({num: "{num}", title: "{title}"})\n  div.msg\n    div.meta\n      span.author\n        a(href="/me/{author_screen_name}") {author_screen_name}\n      span.said  said:\n    div.content {body}\n\n  div.msg.me_msg\n    div.meta\n      span.author {author_screen_name} (me)\n      span.said  said:\n    div.content {body}\n\n  div.msg.chat_msg\n    div.meta\n      span.author {author_screen_name}\n      span.said  said:\n    div.content {body}\n\n  div.msg.chat_msg.me_chat_msg\n    div.meta\n      span.author {author_screen_name} (me)\n      span.said  said:\n    div.content {body}\n\n  div.msg.official.chat_msg\n    div.content {body}\n\n  div.msg.official.chat_msg.errors\n    div.content {body}\n\nappend content\n\n  //- ===========================================================\n  //- ===========================================================\n  //- ===========================================================\n  div#Me\n\n    div.box\n      h3\n        span Box\n        span.sub (Mail)\n      div.content\n        | [placeholder]\n\n\n  div#Sidebar\n\n    div#Me_Intro\n      div.the_life_of The life of...\n      h3.name #{screen_name}\n\n    div.box\n      h3 ~ ~ ~\n      div.content\n        | * * *\n\n\n\n';
    try {
        with (__.locals) {
            __.line = 1, __.col = 1;
            __.r.include("../../layout.blade", __);
            __.line = 3, __.col = 1;
            __.r.func("folder", function(__, f) {
                __.line = 4, __.col = 3;
                __.push("<li");
                __.r.attrs({
                    id: {
                        v: this.id
                    },
                    "class": {
                        v: this.classes,
                        a: "folder"
                    }
                }, __);
                __.push(">");
                __.line = 5, __.col = 5;
                __.push("<a" + ' class="open"');
                __.r.attrs({
                    href: {
                        v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/folder/" + __.r.escape((__.z = f.num) == null ? "" : __.z) + "",
                        e: 1
                    }
                }, __);
                __.push(">" + __.r.escape("" + __.r.escape((__.z = f.title) == null ? "" : __.z) + "") + "</a>" + "</li>");
            }, __);
            __.line = 7, __.col = 1;
            __.r.blockMod("a", "templates", __, function(__) {
                __.line = 8, __.col = 3;
                if (is_customer) {
                    __.line = 9, __.col = 5;
                    __.push("<div" + ' class="customer_screen_names"' + ">");
                    __.line = 10, __.col = 7;
                    __.push(__.r.escape("" + __.r.escape((__.z = customer_screen_names.join(" ")) == null ? "" : __.z) + "") + "</div>");
                }
                __.line = 11, __.col = 3;
                __.r.call("folder", {}, __, {
                    num: "{num}",
                    title: "{title}"
                });
                __.line = 12, __.col = 3;
                __.push("<div" + ' class="msg"' + ">");
                __.line = 13, __.col = 5;
                __.push("<div" + ' class="meta"' + ">");
                __.line = 14, __.col = 7;
                __.push("<span" + ' class="author"' + ">");
                __.line = 15, __.col = 9;
                __.push("<a" + ' href="/me/{author_screen_name}"' + ">" + "{author_screen_name}" + "</a>" + "</span>");
                __.line = 16, __.col = 7;
                __.push("<span" + ' class="said"' + ">" + " said:" + "</span>" + "</div>");
                __.line = 17, __.col = 5;
                __.push("<div" + ' class="content"' + ">" + "{body}" + "</div>" + "</div>");
                __.line = 19, __.col = 3;
                __.push("<div" + ' class="msg me_msg"' + ">");
                __.line = 20, __.col = 5;
                __.push("<div" + ' class="meta"' + ">");
                __.line = 21, __.col = 7;
                __.push("<span" + ' class="author"' + ">" + "{author_screen_name} (me)" + "</span>");
                __.line = 22, __.col = 7;
                __.push("<span" + ' class="said"' + ">" + " said:" + "</span>" + "</div>");
                __.line = 23, __.col = 5;
                __.push("<div" + ' class="content"' + ">" + "{body}" + "</div>" + "</div>");
                __.line = 25, __.col = 3;
                __.push("<div" + ' class="msg chat_msg"' + ">");
                __.line = 26, __.col = 5;
                __.push("<div" + ' class="meta"' + ">");
                __.line = 27, __.col = 7;
                __.push("<span" + ' class="author"' + ">" + "{author_screen_name}" + "</span>");
                __.line = 28, __.col = 7;
                __.push("<span" + ' class="said"' + ">" + " said:" + "</span>" + "</div>");
                __.line = 29, __.col = 5;
                __.push("<div" + ' class="content"' + ">" + "{body}" + "</div>" + "</div>");
                __.line = 31, __.col = 3;
                __.push("<div" + ' class="msg chat_msg me_chat_msg"' + ">");
                __.line = 32, __.col = 5;
                __.push("<div" + ' class="meta"' + ">");
                __.line = 33, __.col = 7;
                __.push("<span" + ' class="author"' + ">" + "{author_screen_name} (me)" + "</span>");
                __.line = 34, __.col = 7;
                __.push("<span" + ' class="said"' + ">" + " said:" + "</span>" + "</div>");
                __.line = 35, __.col = 5;
                __.push("<div" + ' class="content"' + ">" + "{body}" + "</div>" + "</div>");
                __.line = 37, __.col = 3;
                __.push("<div" + ' class="msg official chat_msg"' + ">");
                __.line = 38, __.col = 5;
                __.push("<div" + ' class="content"' + ">" + "{body}" + "</div>" + "</div>");
                __.line = 40, __.col = 3;
                __.push("<div" + ' class="msg official chat_msg errors"' + ">");
                __.line = 41, __.col = 5;
                __.push("<div" + ' class="content"' + ">" + "{body}" + "</div>" + "</div>");
            });
            __.line = 43, __.col = 1;
            __.r.blockMod("a", "content", __, function(__) {
                __.line = 45, __.col = 3;
                __.line = 46, __.col = 3;
                __.line = 47, __.col = 3;
                __.line = 48, __.col = 3;
                __.push("<div" + ' id="Me"' + ">");
                __.line = 50, __.col = 5;
                __.push("<div" + ' class="box"' + ">");
                __.line = 51, __.col = 7;
                __.push("<h3" + ">");
                __.line = 52, __.col = 9;
                __.push("<span" + ">" + "Box" + "</span>");
                __.line = 53, __.col = 9;
                __.push("<span" + ' class="sub"' + ">" + "(Mail)" + "</span>" + "</h3>");
                __.line = 54, __.col = 7;
                __.push("<div" + ' class="content"' + ">");
                __.line = 55, __.col = 9;
                __.push("[placeholder]" + "</div>" + "</div>" + "</div>");
                __.line = 58, __.col = 3;
                __.push("<div" + ' id="Sidebar"' + ">");
                __.line = 60, __.col = 5;
                __.push("<div" + ' id="Me_Intro"' + ">");
                __.line = 61, __.col = 7;
                __.push("<div" + ' class="the_life_of"' + ">" + "The life of..." + "</div>");
                __.line = 62, __.col = 7;
                __.push("<h3" + ' class="name"' + ">" + __.r.escape("" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "") + "</h3>" + "</div>");
                __.line = 64, __.col = 5;
                __.push("<div" + ' class="box"' + ">");
                __.line = 65, __.col = 7;
                __.push("<h3" + ">" + "~ ~ ~" + "</h3>");
                __.line = 66, __.col = 7;
                __.push("<div" + ' class="content"' + ">");
                __.line = 67, __.col = 9;
                __.push("* * *" + "</div>" + "</div>" + "</div>");
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
