function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.base = "/home/da/DEV/apps/okdoki";
    __.rel = "Client/Page/show";
    __.filename = "/home/da/DEV/apps/okdoki/Client/Page/show/markup.blade";
    __.source = 'include "../../layout.blade"\n\nprepend styles\n  call css("/Screen_Name/me.css")\n  call css("/Folder/show.css")\n\nappend templates\n  div.item\n    div {BODY}\n  div.item.with_title\n    h3 {TITLE}\n    div {BODY}\n\nappend content\n\n\n  div#Me\n    h3#The_Title #{title}\n    div.content\n      | From folder:\n      a(href="/me/#{screen_name}/folder/#{folder_num}") #{folder_title}\n\n  div.items#Items\n    div.content\n      - if (is_update_able)\n        div.edit_this\n          div.edit#Edit_This_Page\n            div.success#Success_Msg Your page has been updated.\n            a(href="#Update_Page") Edit This Page.\n          form#Update_Page(action="/me/#{screen_name}/folder/#{folder_num}/page/#{page_num}", method="POST")\n            div.fields\n              div.field.title\n                label Title:\n                input(type="text", name="title", value="#{title}", maxlength="100")\n              div.field.body\n                label Body:\n                textarea#The_Body(name="body") #{page_body}\n            div.buttons\n              input(type="hidden", name="_method", value="PUT")\n              button.submit Save\n              a.cancel(href="#cancel") Cancel\n\n      div.list\n        div.item#The_Page_Content\n          |! !{page_body_html}\n\n  div#Create\n    div.create Add:\n    div.link.active\n      a(href="#Page") More Text\n  div#Creates\n    div.create#Page\n      form(action="/me/#{screen_name}/folder/#{folder_num}/page/#{page_num}/create/text", method="POST")\n        div.fields\n          div.field.title\n            label Title:\n            span.value (optional)\n            div.ele\n              input.field(type=\'text\', name="title", value="")\n          div.field.content\n            label Text:\n            div.ele\n              textarea(name="body")\n        div.buttons\n          input(type="hidden", name="stuff_type", value="page")\n          button.submit Create\n\n\n\n\n\n\n';
    try {
        with (__.locals) {
            __.line = 1, __.col = 1;
            __.r.include("../../layout.blade", __);
            __.line = 3, __.col = 1;
            __.r.blockMod("p", "styles", __, function(__) {
                __.line = 4, __.col = 3;
                __.r.call("css", {}, __, "/Screen_Name/me.css");
                __.line = 5, __.col = 3;
                __.r.call("css", {}, __, "/Folder/show.css");
            });
            __.line = 7, __.col = 1;
            __.r.blockMod("a", "templates", __, function(__) {
                __.line = 8, __.col = 3;
                __.push("<div" + ' class="item"' + ">");
                __.line = 9, __.col = 5;
                __.push("<div" + ">" + "{BODY}" + "</div>" + "</div>");
                __.line = 10, __.col = 3;
                __.push("<div" + ' class="item with_title"' + ">");
                __.line = 11, __.col = 5;
                __.push("<h3" + ">" + "{TITLE}" + "</h3>");
                __.line = 12, __.col = 5;
                __.push("<div" + ">" + "{BODY}" + "</div>" + "</div>");
            });
            __.line = 14, __.col = 1;
            __.r.blockMod("a", "content", __, function(__) {
                __.line = 17, __.col = 3;
                __.push("<div" + ' id="Me"' + ">");
                __.line = 18, __.col = 5;
                __.push("<h3" + ' id="The_Title"' + ">" + __.r.escape("" + __.r.escape((__.z = title) == null ? "" : __.z) + "") + "</h3>");
                __.line = 19, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 20, __.col = 7;
                __.push("From folder:");
                __.line = 21, __.col = 7;
                __.push("<a");
                __.r.attrs({
                    href: {
                        v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/folder/" + __.r.escape((__.z = folder_num) == null ? "" : __.z) + "",
                        e: 1
                    }
                }, __);
                __.push(">" + __.r.escape("" + __.r.escape((__.z = folder_title) == null ? "" : __.z) + "") + "</a>" + "</div>" + "</div>");
                __.line = 23, __.col = 3;
                __.push("<div" + ' id="Items"' + ' class="items"' + ">");
                __.line = 24, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 25, __.col = 7;
                if (is_update_able) {
                    __.line = 26, __.col = 9;
                    __.push("<div" + ' class="edit_this"' + ">");
                    __.line = 27, __.col = 11;
                    __.push("<div" + ' id="Edit_This_Page"' + ' class="edit"' + ">");
                    __.line = 28, __.col = 13;
                    __.push("<div" + ' id="Success_Msg"' + ' class="success"' + ">" + "Your page has been updated." + "</div>");
                    __.line = 29, __.col = 13;
                    __.push("<a" + ' href="#Update_Page"' + ">" + "Edit This Page." + "</a>" + "</div>");
                    __.line = 30, __.col = 11;
                    __.push("<form" + ' method="POST"' + ' id="Update_Page"');
                    __.r.attrs({
                        action: {
                            v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/folder/" + __.r.escape((__.z = folder_num) == null ? "" : __.z) + "/page/" + __.r.escape((__.z = page_num) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push(">");
                    __.line = 31, __.col = 13;
                    __.push("<div" + ' class="fields"' + ">");
                    __.line = 32, __.col = 15;
                    __.push("<div" + ' class="field title"' + ">");
                    __.line = 33, __.col = 17;
                    __.push("<label" + ">" + "Title:" + "</label>");
                    __.line = 34, __.col = 17;
                    __.push("<input" + ' type="text"' + ' name="title"' + ' maxlength="100"');
                    __.r.attrs({
                        value: {
                            v: "" + __.r.escape((__.z = title) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push("/>" + "</div>");
                    __.line = 35, __.col = 15;
                    __.push("<div" + ' class="field body"' + ">");
                    __.line = 36, __.col = 17;
                    __.push("<label" + ">" + "Body:" + "</label>");
                    __.line = 37, __.col = 17;
                    __.push("<textarea" + ' name="body"' + ' id="The_Body"' + ">" + __.r.escape("" + __.r.escape((__.z = page_body) == null ? "" : __.z) + "") + "</textarea>" + "</div>" + "</div>");
                    __.line = 38, __.col = 13;
                    __.push("<div" + ' class="buttons"' + ">");
                    __.line = 39, __.col = 15;
                    __.push("<input" + ' type="hidden"' + ' name="_method"' + ' value="PUT"' + "/>");
                    __.line = 40, __.col = 15;
                    __.push("<button" + ' class="submit"' + ">" + "Save" + "</button>");
                    __.line = 41, __.col = 15;
                    __.push("<a" + ' href="#cancel"' + ' class="cancel"' + ">" + "Cancel" + "</a>" + "</div>" + "</form>" + "</div>");
                }
                __.line = 43, __.col = 7;
                __.push("<div" + ' class="list"' + ">");
                __.line = 44, __.col = 9;
                __.push("<div" + ' id="The_Page_Content"' + ' class="item"' + ">");
                __.line = 45, __.col = 11;
                __.push("" + ((__.z = page_body_html) == null ? "" : __.z) + "" + "</div>" + "</div>" + "</div>" + "</div>");
                __.line = 47, __.col = 3;
                __.push("<div" + ' id="Create"' + ">");
                __.line = 48, __.col = 5;
                __.push("<div" + ' class="create"' + ">" + "Add:" + "</div>");
                __.line = 49, __.col = 5;
                __.push("<div" + ' class="link active"' + ">");
                __.line = 50, __.col = 7;
                __.push("<a" + ' href="#Page"' + ">" + "More Text" + "</a>" + "</div>" + "</div>");
                __.line = 51, __.col = 3;
                __.push("<div" + ' id="Creates"' + ">");
                __.line = 52, __.col = 5;
                __.push("<div" + ' id="Page"' + ' class="create"' + ">");
                __.line = 53, __.col = 7;
                __.push("<form" + ' method="POST"');
                __.r.attrs({
                    action: {
                        v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/folder/" + __.r.escape((__.z = folder_num) == null ? "" : __.z) + "/page/" + __.r.escape((__.z = page_num) == null ? "" : __.z) + "/create/text",
                        e: 1
                    }
                }, __);
                __.push(">");
                __.line = 54, __.col = 9;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 55, __.col = 11;
                __.push("<div" + ' class="field title"' + ">");
                __.line = 56, __.col = 13;
                __.push("<label" + ">" + "Title:" + "</label>");
                __.line = 57, __.col = 13;
                __.push("<span" + ' class="value"' + ">" + "(optional)" + "</span>");
                __.line = 58, __.col = 13;
                __.push("<div" + ' class="ele"' + ">");
                __.line = 59, __.col = 15;
                __.push("<input" + ' type="text"' + ' name="title"' + ' class="field"');
                __.r.attrs({
                    value: {
                        v: undefined,
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>" + "</div>");
                __.line = 60, __.col = 11;
                __.push("<div" + ' class="field content"' + ">");
                __.line = 61, __.col = 13;
                __.push("<label" + ">" + "Text:" + "</label>");
                __.line = 62, __.col = 13;
                __.push("<div" + ' class="ele"' + ">");
                __.line = 63, __.col = 15;
                __.push("<textarea" + ' name="body"' + ">" + "</textarea>" + "</div>" + "</div>" + "</div>");
                __.line = 64, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 65, __.col = 11;
                __.push("<input" + ' type="hidden"' + ' name="stuff_type"' + ' value="page"' + "/>");
                __.line = 66, __.col = 11;
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
