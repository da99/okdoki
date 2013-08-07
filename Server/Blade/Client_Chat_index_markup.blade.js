function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.base = "/home/da/DEV/apps/okdoki";
    __.rel = "Client/Chat/index";
    __.filename = "/home/da/DEV/apps/okdoki/Client/Chat/index/markup.blade";
    __.source = 'include "../../layout.blade"\n\nappend styles\n  link(rel="stylesheet", media="screen", href="http://openfontlibrary.org/face/circus", rel="stylesheet", type="text/css")\nappend templates\n  div.msg(id="{dom_id}")\n    div.meta\n      span.author\n        a(href="/me/{author_screen_name}") {author_screen_name}\n      span.said  said:\n    div.content {body}\n\n  div.msg.me_msg(id="{dom_id}")\n    div.meta\n      span.author {author_screen_name} (me)\n      span.said  said:\n    div.content {body}\n\n  div.msg.chatter_msg.chat_msg(id="{dom_id}")\n    div.meta\n      span.author {author_screen_name}\n      span.said  said:\n    div.content {body}\n\n  div.msg.chat_msg.me_chat_msg(id="{dom_id}")\n    div.meta\n      span.author {author_screen_name} (me)\n      span.said  said:\n    div.content {body}\n\n  div.msg.official.chat_msg(id="{dom_id}")\n    div.content {body}\n\n  div.msg.official.chat_msg.error_msg(id="{dom_id}")\n    div.content {body}\n\nappend content\n\n  h1 #{screen_name}\'s Chat Room\n\n  - if (is_stranger)\n    div#One_More_Step\n      div.box\n        h3 You\'re almost inside:\n        div.content\n          div.p\n            a(href="/me/#{screen_name}") #{screen_name}\n            span> uses\n            a(href="/") Okdoki.com\n            span>\n              | to manage their chat room.\n            br\n            span> You have to\n            a(href="/") log-in or create an account\n            span> there.\n            br\n            span>\n              | Then, come back and start chatting.\n\n  - else\n    - if (!is_owner && !customer_has_one_life)\n      div#One_More_Step\n        div.box\n          div.content\n            form#Choose_Life(action="/me/#{screen_name}/chat/enter", method="POST")\n              div.fields\n                div.field.life\n                  span.label Which screen name to use?\n                  select(name="as_this_life")\n                    - for (var i in customer_screen_names)\n                      option(value="#{customer_screen_names[i]}") #{customer_screen_names[i]}\n              div.buttons\n                button.submit Enter\n\n  //&& !customer_has_one_life)\n\n  div#The_Door\n    div#Boxs\n\n      div.box#Audience\n        div.content\n          ul#Seat_List\n\n      div.box#Write\n        div.content\n          form#Write_Chit_Chat(action="/me/#{screen_name}/chat/msg", method="post")\n            div.fields\n              div.field\n                span.label Type your message to the room:\n                textarea(name="body")\n            div.buttons\n              button.submit Send to chat room.\n\n    div#Chats\n      div.msgs#Chat_Msgs\n\n\n\n\n\n';
    try {
        with (__.locals) {
            __.line = 1, __.col = 1;
            __.r.include("../../layout.blade", __);
            __.line = 3, __.col = 1;
            __.r.blockMod("a", "styles", __, function(__) {
                __.line = 4, __.col = 3;
                __.push("<link" + ' rel="stylesheet"' + ' media="screen"' + ' href="http://openfontlibrary.org/face/circus"' + ' type="text/css"' + "/>");
            });
            __.line = 5, __.col = 1;
            __.r.blockMod("a", "templates", __, function(__) {
                __.line = 6, __.col = 3;
                __.push("<div" + ' id="{dom_id}"' + ' class="msg"' + ">");
                __.line = 7, __.col = 5;
                __.push("<div" + ' class="meta"' + ">");
                __.line = 8, __.col = 7;
                __.push("<span" + ' class="author"' + ">");
                __.line = 9, __.col = 9;
                __.push("<a" + ' href="/me/{author_screen_name}"' + ">" + "{author_screen_name}" + "</a>" + "</span>");
                __.line = 10, __.col = 7;
                __.push("<span" + ' class="said"' + ">" + " said:" + "</span>" + "</div>");
                __.line = 11, __.col = 5;
                __.push("<div" + ' class="content"' + ">" + "{body}" + "</div>" + "</div>");
                __.line = 13, __.col = 3;
                __.push("<div" + ' id="{dom_id}"' + ' class="msg me_msg"' + ">");
                __.line = 14, __.col = 5;
                __.push("<div" + ' class="meta"' + ">");
                __.line = 15, __.col = 7;
                __.push("<span" + ' class="author"' + ">" + "{author_screen_name} (me)" + "</span>");
                __.line = 16, __.col = 7;
                __.push("<span" + ' class="said"' + ">" + " said:" + "</span>" + "</div>");
                __.line = 17, __.col = 5;
                __.push("<div" + ' class="content"' + ">" + "{body}" + "</div>" + "</div>");
                __.line = 19, __.col = 3;
                __.push("<div" + ' id="{dom_id}"' + ' class="msg chatter_msg chat_msg"' + ">");
                __.line = 20, __.col = 5;
                __.push("<div" + ' class="meta"' + ">");
                __.line = 21, __.col = 7;
                __.push("<span" + ' class="author"' + ">" + "{author_screen_name}" + "</span>");
                __.line = 22, __.col = 7;
                __.push("<span" + ' class="said"' + ">" + " said:" + "</span>" + "</div>");
                __.line = 23, __.col = 5;
                __.push("<div" + ' class="content"' + ">" + "{body}" + "</div>" + "</div>");
                __.line = 25, __.col = 3;
                __.push("<div" + ' id="{dom_id}"' + ' class="msg chat_msg me_chat_msg"' + ">");
                __.line = 26, __.col = 5;
                __.push("<div" + ' class="meta"' + ">");
                __.line = 27, __.col = 7;
                __.push("<span" + ' class="author"' + ">" + "{author_screen_name} (me)" + "</span>");
                __.line = 28, __.col = 7;
                __.push("<span" + ' class="said"' + ">" + " said:" + "</span>" + "</div>");
                __.line = 29, __.col = 5;
                __.push("<div" + ' class="content"' + ">" + "{body}" + "</div>" + "</div>");
                __.line = 31, __.col = 3;
                __.push("<div" + ' id="{dom_id}"' + ' class="msg official chat_msg"' + ">");
                __.line = 32, __.col = 5;
                __.push("<div" + ' class="content"' + ">" + "{body}" + "</div>" + "</div>");
                __.line = 34, __.col = 3;
                __.push("<div" + ' id="{dom_id}"' + ' class="msg official chat_msg error_msg"' + ">");
                __.line = 35, __.col = 5;
                __.push("<div" + ' class="content"' + ">" + "{body}" + "</div>" + "</div>");
            });
            __.line = 37, __.col = 1;
            __.r.blockMod("a", "content", __, function(__) {
                __.line = 39, __.col = 3;
                __.push("<h1" + ">" + __.r.escape("" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "'s Chat Room") + "</h1>");
                __.line = 41, __.col = 3;
                if (is_stranger) {
                    __.line = 42, __.col = 5;
                    __.push("<div" + ' id="One_More_Step"' + ">");
                    __.line = 43, __.col = 7;
                    __.push("<div" + ' class="box"' + ">");
                    __.line = 44, __.col = 9;
                    __.push("<h3" + ">" + "You're almost inside:" + "</h3>");
                    __.line = 45, __.col = 9;
                    __.push("<div" + ' class="content"' + ">");
                    __.line = 46, __.col = 11;
                    __.push("<div" + ' class="p"' + ">");
                    __.line = 47, __.col = 13;
                    __.push("<a");
                    __.r.attrs({
                        href: {
                            v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push(">" + __.r.escape("" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "") + "</a>");
                    __.line = 48, __.col = 13;
                    __.push("<span" + ">" + "uses" + "</span>" + " ");
                    __.line = 49, __.col = 13;
                    __.push("<a" + ' href="/"' + ">" + "Okdoki.com" + "</a>");
                    __.line = 50, __.col = 13;
                    __.push("<span" + ">");
                    __.line = 51, __.col = 15;
                    __.push("to manage their chat room." + "</span>" + " ");
                    __.line = 52, __.col = 13;
                    __.push("<br" + "/>");
                    __.line = 53, __.col = 13;
                    __.push("<span" + ">" + "You have to" + "</span>" + " ");
                    __.line = 54, __.col = 13;
                    __.push("<a" + ' href="/"' + ">" + "log-in or create an account" + "</a>");
                    __.line = 55, __.col = 13;
                    __.push("<span" + ">" + "there." + "</span>" + " ");
                    __.line = 56, __.col = 13;
                    __.push("<br" + "/>");
                    __.line = 57, __.col = 13;
                    __.push("<span" + ">");
                    __.line = 58, __.col = 15;
                    __.push("Then, come back and start chatting." + "</span>" + " " + "</div>" + "</div>" + "</div>" + "</div>");
                } else {
                    if (!is_owner && !customer_has_one_life) {
                        __.line = 62, __.col = 7;
                        __.push("<div" + ' id="One_More_Step"' + ">");
                        __.line = 63, __.col = 9;
                        __.push("<div" + ' class="box"' + ">");
                        __.line = 64, __.col = 11;
                        __.push("<div" + ' class="content"' + ">");
                        __.line = 65, __.col = 13;
                        __.push("<form" + ' method="POST"' + ' id="Choose_Life"');
                        __.r.attrs({
                            action: {
                                v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/chat/enter",
                                e: 1
                            }
                        }, __);
                        __.push(">");
                        __.line = 66, __.col = 15;
                        __.push("<div" + ' class="fields"' + ">");
                        __.line = 67, __.col = 17;
                        __.push("<div" + ' class="field life"' + ">");
                        __.line = 68, __.col = 19;
                        __.push("<span" + ' class="label"' + ">" + "Which screen name to use?" + "</span>");
                        __.line = 69, __.col = 19;
                        __.push("<select" + ' name="as_this_life"' + ">");
                        __.line = 70, __.col = 21;
                        for (var i in customer_screen_names) {
                            __.line = 71, __.col = 23;
                            __.push("<option");
                            __.r.attrs({
                                value: {
                                    v: "" + __.r.escape((__.z = customer_screen_names[i]) == null ? "" : __.z) + "",
                                    e: 1
                                }
                            }, __);
                            __.push(">" + __.r.escape("" + __.r.escape((__.z = customer_screen_names[i]) == null ? "" : __.z) + "") + "</option>");
                        }
                        __.push("</select>" + "</div>" + "</div>");
                        __.line = 72, __.col = 15;
                        __.push("<div" + ' class="buttons"' + ">");
                        __.line = 73, __.col = 17;
                        __.push("<button" + ' class="submit"' + ">" + "Enter" + "</button>" + "</div>" + "</form>" + "</div>" + "</div>" + "</div>");
                    }
                }
                __.line = 75, __.col = 3;
                __.push("<!--" + "&& !customer_has_one_life)" + "-->");
                __.line = 77, __.col = 3;
                __.push("<div" + ' id="The_Door"' + ">");
                __.line = 78, __.col = 5;
                __.push("<div" + ' id="Boxs"' + ">");
                __.line = 80, __.col = 7;
                __.push("<div" + ' id="Audience"' + ' class="box"' + ">");
                __.line = 81, __.col = 9;
                __.push("<div" + ' class="content"' + ">");
                __.line = 82, __.col = 11;
                __.push("<ul" + ' id="Seat_List"' + ">" + "</ul>" + "</div>" + "</div>");
                __.line = 84, __.col = 7;
                __.push("<div" + ' id="Write"' + ' class="box"' + ">");
                __.line = 85, __.col = 9;
                __.push("<div" + ' class="content"' + ">");
                __.line = 86, __.col = 11;
                __.push("<form" + ' method="post"' + ' id="Write_Chit_Chat"');
                __.r.attrs({
                    action: {
                        v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/chat/msg",
                        e: 1
                    }
                }, __);
                __.push(">");
                __.line = 87, __.col = 13;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 88, __.col = 15;
                __.push("<div" + ' class="field"' + ">");
                __.line = 89, __.col = 17;
                __.push("<span" + ' class="label"' + ">" + "Type your message to the room:" + "</span>");
                __.line = 90, __.col = 17;
                __.push("<textarea" + ' name="body"' + ">" + "</textarea>" + "</div>" + "</div>");
                __.line = 91, __.col = 13;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 92, __.col = 15;
                __.push("<button" + ' class="submit"' + ">" + "Send to chat room." + "</button>" + "</div>" + "</form>" + "</div>" + "</div>" + "</div>");
                __.line = 94, __.col = 5;
                __.push("<div" + ' id="Chats"' + ">");
                __.line = 95, __.col = 7;
                __.push("<div" + ' id="Chat_Msgs"' + ' class="msgs"' + ">" + "</div>" + "</div>" + "</div>");
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
