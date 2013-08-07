function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.base = "/home/da/DEV/apps/okdoki";
    __.rel = "Client/Folder/show";
    __.filename = "/home/da/DEV/apps/okdoki/Client/Folder/show/markup.blade";
    __.source = 'include "../../layout.blade"\n\nfunction draw_page(page)\n  div.page\n    - if (page.created_at.getTime)\n      span.time #{page.created_at.getTime()}\n    - else\n      span.time #{page.created_at}\n    span.divider  -&nbsp;\n    a(href="/me/#{screen_name}/folder/#{folder_num}/page/#{page.num}") #{page.title}\n\nprepend styles\n  call css("/Screen_Name/me.css")\n\nappend templates\n\n  call draw_page({created_at: "{TIME}", title: "{TITLE}", num: "{NUM}"})\n\n  div.box.item\n    h3 {TITLE}\n    div.content\n      div.buttons\n        a.open(href="{LOCATION}") Open\n\n  div.success.page_created\n    | Your new page is located at:\n    a(href="{HREF}")\n      | {HREF}\n\n\nappend content\n\n\n  div#Me\n    h3 #{title}\n    div.content\n      div\n        | A folder from the life of:\n        a(href="#{website_location}") #{screen_name}\n\n  - if (is_customer)\n    div#Create\n      div.create Create:\n      div.link.active\n        a(href="#Page") New Page\n      //- div.link\n        //- a(href="#Photo") Photo\n      //- div.link\n        //- a(href="#Video") Video\n      //- div.link\n        //- a(href="#Link") Link\n      //- div.link\n        //- a(href="#Text") Text\n      //- div.link\n        //- a(href="#Quote") Quote\n      //- div.link\n        //- a(href="#Person") Person\n\n\n    div#Creates\n      div.create#Photo\n        form(action="/folder/#{folder_num}/attach_photo", method="POST")\n          div.fields\n            div.field.location\n              label Location:\n              div.ele\n                input.field(type=\'text\', name="location", value="")\n            div.field.desc\n              label Description:\n              span.sub (optional)\n              div.ele\n                textarea\n          div.buttons\n            button.submit Attach\n            a.cancel(href="#cancel") Cancel\n\n      div.create#Video\n        form(action="/folder/#{folder_num}/attach_video", method="POST")\n          div.fields\n            div.field.location\n              label Location:\n              div.ele\n                input.field(type=\'text\', name="location", value="")\n            div.field.desc\n              label Description:\n              span.sub (optional)\n              div.ele\n                textarea\n          div.buttons\n            button.submit Attach\n            a.cancel(href="#cancel") Cancel\n\n      div.create#Text\n        form(action="/folder/#{folder_num}/attach_text", method="POST")\n          div.fields\n            div.field.title\n              label Title:\n              span.sub (optional)\n              div.ele\n                input.field(type=\'text\', name="title", value="")\n            div.field.content\n              label Content:\n              div.ele\n                textarea\n          div.buttons\n            button.submit Attach\n            a.cancel(href="#cancel") Cancel\n\n      div.create#Link\n        form(action="/folder/#{folder_num}/attach_link", method="POST")\n          div.fields\n            div.field.photo_location\n              label Covor photo location:\n              span.sub (optional)\n              div.ele\n                input.field(type=\'text\', name="cover_photo_location", value="")\n            div.field.location\n              label Link Address:\n              div.ele\n                input.field(type=\'text\', name="location", value="")\n            div.field.desc\n              label Description:\n              span.sub (optional)\n              div.ele\n                textarea\n          div.buttons\n            button.submit Attach\n            a.cancel(href="#cancel") Cancel\n\n      div.create#Page\n        form(action="/me/#{screen_name}/folder/#{folder_num}/page", method="POST")\n          div.fields\n            div.field.title\n              label Title:\n              div.ele\n                input.field(type=\'text\', name="title", value="")\n          div.buttons\n            input(type="hidden", name="stuff_type", value="page")\n            call applet("as_this_life")\n            button.submit Create\n\n      div.create#Quote\n        form(action="/folder/#{folder_num}/attach_quote", method="POST")\n          div.fields\n            div.field.body\n              label body:\n              div.ele\n                textarea(name="body")\n            div.field.by\n              label Author:\n              div.ele\n                textarea(name="by")\n          div.buttons\n            button.submit Attach\n            a.cancel(href="#cancel") Cancel\n\n      div.create#Person\n        form(action="/folder/#{folder_num}/attach_person", method="POST")\n          div.fields\n            div.field.first_name\n              label First Name:\n              div.ele\n                input.field(type=\'text\', name="first_name", value="")\n            div.field.last_name\n              label Last Name:\n              div.ele\n                input.field(type=\'text\', name="last_name", value="")\n            div.field.comment\n              label Comment:\n              div.ele\n                textarea(name="comment")\n          div.buttons\n            button.submit Attach\n            a.cancel(href="#cancel") Cancel\n\n  div.boxs\n    div.box.item\n      div.content\n        div.title\n          | Something happened to me last night\n          | when I was driving home. I had a couple\n          | of miles to go.\n        div.buttons\n          a(href="#edit") Edit\n\n  div#Pages\n    - for (var x in pages)\n      call draw_page(pages[x].data)\n\n\n\n\n\n\n\n\n\n';
    try {
        with (__.locals) {
            __.line = 1, __.col = 1;
            __.r.include("../../layout.blade", __);
            __.line = 3, __.col = 1;
            __.r.func("draw_page", function(__, page) {
                __.line = 4, __.col = 3;
                __.push("<div");
                __.r.attrs({
                    id: {
                        v: this.id
                    },
                    "class": {
                        v: this.classes,
                        a: "page"
                    }
                }, __);
                __.push(">");
                __.line = 5, __.col = 5;
                if (page.created_at.getTime) {
                    __.line = 6, __.col = 7;
                    __.push("<span" + ' class="time"' + ">" + __.r.escape("" + __.r.escape((__.z = page.created_at.getTime()) == null ? "" : __.z) + "") + "</span>");
                } else {
                    __.line = 8, __.col = 7;
                    __.push("<span" + ' class="time"' + ">" + __.r.escape("" + __.r.escape((__.z = page.created_at) == null ? "" : __.z) + "") + "</span>");
                }
                __.line = 9, __.col = 5;
                __.push("<span" + ' class="divider"' + ">" + " -&nbsp;" + "</span>");
                __.line = 10, __.col = 5;
                __.push("<a");
                __.r.attrs({
                    href: {
                        v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/folder/" + __.r.escape((__.z = folder_num) == null ? "" : __.z) + "/page/" + __.r.escape((__.z = page.num) == null ? "" : __.z) + "",
                        e: 1
                    }
                }, __);
                __.push(">" + __.r.escape("" + __.r.escape((__.z = page.title) == null ? "" : __.z) + "") + "</a>" + "</div>");
            }, __);
            __.line = 12, __.col = 1;
            __.r.blockMod("p", "styles", __, function(__) {
                __.line = 13, __.col = 3;
                __.r.call("css", {}, __, "/Screen_Name/me.css");
            });
            __.line = 15, __.col = 1;
            __.r.blockMod("a", "templates", __, function(__) {
                __.line = 17, __.col = 3;
                __.r.call("draw_page", {}, __, {
                    created_at: "{TIME}",
                    title: "{TITLE}",
                    num: "{NUM}"
                });
                __.line = 19, __.col = 3;
                __.push("<div" + ' class="box item"' + ">");
                __.line = 20, __.col = 5;
                __.push("<h3" + ">" + "{TITLE}" + "</h3>");
                __.line = 21, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 22, __.col = 7;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 23, __.col = 9;
                __.push("<a" + ' href="{LOCATION}"' + ' class="open"' + ">" + "Open" + "</a>" + "</div>" + "</div>" + "</div>");
                __.line = 25, __.col = 3;
                __.push("<div" + ' class="success page_created"' + ">");
                __.line = 26, __.col = 5;
                __.push("Your new page is located at:");
                __.line = 27, __.col = 5;
                __.push("<a" + ' href="{HREF}"' + ">");
                __.line = 28, __.col = 7;
                __.push("{HREF}" + "</a>" + "</div>");
            });
            __.line = 31, __.col = 1;
            __.r.blockMod("a", "content", __, function(__) {
                __.line = 34, __.col = 3;
                __.push("<div" + ' id="Me"' + ">");
                __.line = 35, __.col = 5;
                __.push("<h3" + ">" + __.r.escape("" + __.r.escape((__.z = title) == null ? "" : __.z) + "") + "</h3>");
                __.line = 36, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 37, __.col = 7;
                __.push("<div" + ">");
                __.line = 38, __.col = 9;
                __.push("A folder from the life of:");
                __.line = 39, __.col = 9;
                __.push("<a");
                __.r.attrs({
                    href: {
                        v: "" + __.r.escape((__.z = website_location) == null ? "" : __.z) + "",
                        e: 1
                    }
                }, __);
                __.push(">" + __.r.escape("" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "") + "</a>" + "</div>" + "</div>" + "</div>");
                __.line = 41, __.col = 3;
                if (is_customer) {
                    __.line = 42, __.col = 5;
                    __.push("<div" + ' id="Create"' + ">");
                    __.line = 43, __.col = 7;
                    __.push("<div" + ' class="create"' + ">" + "Create:" + "</div>");
                    __.line = 44, __.col = 7;
                    __.push("<div" + ' class="link active"' + ">");
                    __.line = 45, __.col = 9;
                    __.push("<a" + ' href="#Page"' + ">" + "New Page" + "</a>" + "</div>");
                    __.line = 46, __.col = 7;
                    __.line = 48, __.col = 7;
                    __.line = 50, __.col = 7;
                    __.line = 52, __.col = 7;
                    __.line = 54, __.col = 7;
                    __.line = 56, __.col = 7;
                    __.push("</div>");
                    __.line = 60, __.col = 5;
                    __.push("<div" + ' id="Creates"' + ">");
                    __.line = 61, __.col = 7;
                    __.push("<div" + ' id="Photo"' + ' class="create"' + ">");
                    __.line = 62, __.col = 9;
                    __.push("<form" + ' method="POST"');
                    __.r.attrs({
                        action: {
                            v: "/folder/" + __.r.escape((__.z = folder_num) == null ? "" : __.z) + "/attach_photo",
                            e: 1
                        }
                    }, __);
                    __.push(">");
                    __.line = 63, __.col = 11;
                    __.push("<div" + ' class="fields"' + ">");
                    __.line = 64, __.col = 13;
                    __.push("<div" + ' class="field location"' + ">");
                    __.line = 65, __.col = 15;
                    __.push("<label" + ">" + "Location:" + "</label>");
                    __.line = 66, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 67, __.col = 17;
                    __.push("<input" + ' type="text"' + ' name="location"' + ' class="field"');
                    __.r.attrs({
                        value: {
                            v: undefined,
                            e: 1
                        }
                    }, __);
                    __.push("/>" + "</div>" + "</div>");
                    __.line = 68, __.col = 13;
                    __.push("<div" + ' class="field desc"' + ">");
                    __.line = 69, __.col = 15;
                    __.push("<label" + ">" + "Description:" + "</label>");
                    __.line = 70, __.col = 15;
                    __.push("<span" + ' class="sub"' + ">" + "(optional)" + "</span>");
                    __.line = 71, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 72, __.col = 17;
                    __.push("<textarea" + ">" + "</textarea>" + "</div>" + "</div>" + "</div>");
                    __.line = 73, __.col = 11;
                    __.push("<div" + ' class="buttons"' + ">");
                    __.line = 74, __.col = 13;
                    __.push("<button" + ' class="submit"' + ">" + "Attach" + "</button>");
                    __.line = 75, __.col = 13;
                    __.push("<a" + ' href="#cancel"' + ' class="cancel"' + ">" + "Cancel" + "</a>" + "</div>" + "</form>" + "</div>");
                    __.line = 77, __.col = 7;
                    __.push("<div" + ' id="Video"' + ' class="create"' + ">");
                    __.line = 78, __.col = 9;
                    __.push("<form" + ' method="POST"');
                    __.r.attrs({
                        action: {
                            v: "/folder/" + __.r.escape((__.z = folder_num) == null ? "" : __.z) + "/attach_video",
                            e: 1
                        }
                    }, __);
                    __.push(">");
                    __.line = 79, __.col = 11;
                    __.push("<div" + ' class="fields"' + ">");
                    __.line = 80, __.col = 13;
                    __.push("<div" + ' class="field location"' + ">");
                    __.line = 81, __.col = 15;
                    __.push("<label" + ">" + "Location:" + "</label>");
                    __.line = 82, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 83, __.col = 17;
                    __.push("<input" + ' type="text"' + ' name="location"' + ' class="field"');
                    __.r.attrs({
                        value: {
                            v: undefined,
                            e: 1
                        }
                    }, __);
                    __.push("/>" + "</div>" + "</div>");
                    __.line = 84, __.col = 13;
                    __.push("<div" + ' class="field desc"' + ">");
                    __.line = 85, __.col = 15;
                    __.push("<label" + ">" + "Description:" + "</label>");
                    __.line = 86, __.col = 15;
                    __.push("<span" + ' class="sub"' + ">" + "(optional)" + "</span>");
                    __.line = 87, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 88, __.col = 17;
                    __.push("<textarea" + ">" + "</textarea>" + "</div>" + "</div>" + "</div>");
                    __.line = 89, __.col = 11;
                    __.push("<div" + ' class="buttons"' + ">");
                    __.line = 90, __.col = 13;
                    __.push("<button" + ' class="submit"' + ">" + "Attach" + "</button>");
                    __.line = 91, __.col = 13;
                    __.push("<a" + ' href="#cancel"' + ' class="cancel"' + ">" + "Cancel" + "</a>" + "</div>" + "</form>" + "</div>");
                    __.line = 93, __.col = 7;
                    __.push("<div" + ' id="Text"' + ' class="create"' + ">");
                    __.line = 94, __.col = 9;
                    __.push("<form" + ' method="POST"');
                    __.r.attrs({
                        action: {
                            v: "/folder/" + __.r.escape((__.z = folder_num) == null ? "" : __.z) + "/attach_text",
                            e: 1
                        }
                    }, __);
                    __.push(">");
                    __.line = 95, __.col = 11;
                    __.push("<div" + ' class="fields"' + ">");
                    __.line = 96, __.col = 13;
                    __.push("<div" + ' class="field title"' + ">");
                    __.line = 97, __.col = 15;
                    __.push("<label" + ">" + "Title:" + "</label>");
                    __.line = 98, __.col = 15;
                    __.push("<span" + ' class="sub"' + ">" + "(optional)" + "</span>");
                    __.line = 99, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 100, __.col = 17;
                    __.push("<input" + ' type="text"' + ' name="title"' + ' class="field"');
                    __.r.attrs({
                        value: {
                            v: undefined,
                            e: 1
                        }
                    }, __);
                    __.push("/>" + "</div>" + "</div>");
                    __.line = 101, __.col = 13;
                    __.push("<div" + ' class="field content"' + ">");
                    __.line = 102, __.col = 15;
                    __.push("<label" + ">" + "Content:" + "</label>");
                    __.line = 103, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 104, __.col = 17;
                    __.push("<textarea" + ">" + "</textarea>" + "</div>" + "</div>" + "</div>");
                    __.line = 105, __.col = 11;
                    __.push("<div" + ' class="buttons"' + ">");
                    __.line = 106, __.col = 13;
                    __.push("<button" + ' class="submit"' + ">" + "Attach" + "</button>");
                    __.line = 107, __.col = 13;
                    __.push("<a" + ' href="#cancel"' + ' class="cancel"' + ">" + "Cancel" + "</a>" + "</div>" + "</form>" + "</div>");
                    __.line = 109, __.col = 7;
                    __.push("<div" + ' id="Link"' + ' class="create"' + ">");
                    __.line = 110, __.col = 9;
                    __.push("<form" + ' method="POST"');
                    __.r.attrs({
                        action: {
                            v: "/folder/" + __.r.escape((__.z = folder_num) == null ? "" : __.z) + "/attach_link",
                            e: 1
                        }
                    }, __);
                    __.push(">");
                    __.line = 111, __.col = 11;
                    __.push("<div" + ' class="fields"' + ">");
                    __.line = 112, __.col = 13;
                    __.push("<div" + ' class="field photo_location"' + ">");
                    __.line = 113, __.col = 15;
                    __.push("<label" + ">" + "Covor photo location:" + "</label>");
                    __.line = 114, __.col = 15;
                    __.push("<span" + ' class="sub"' + ">" + "(optional)" + "</span>");
                    __.line = 115, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 116, __.col = 17;
                    __.push("<input" + ' type="text"' + ' name="cover_photo_location"' + ' class="field"');
                    __.r.attrs({
                        value: {
                            v: undefined,
                            e: 1
                        }
                    }, __);
                    __.push("/>" + "</div>" + "</div>");
                    __.line = 117, __.col = 13;
                    __.push("<div" + ' class="field location"' + ">");
                    __.line = 118, __.col = 15;
                    __.push("<label" + ">" + "Link Address:" + "</label>");
                    __.line = 119, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 120, __.col = 17;
                    __.push("<input" + ' type="text"' + ' name="location"' + ' class="field"');
                    __.r.attrs({
                        value: {
                            v: undefined,
                            e: 1
                        }
                    }, __);
                    __.push("/>" + "</div>" + "</div>");
                    __.line = 121, __.col = 13;
                    __.push("<div" + ' class="field desc"' + ">");
                    __.line = 122, __.col = 15;
                    __.push("<label" + ">" + "Description:" + "</label>");
                    __.line = 123, __.col = 15;
                    __.push("<span" + ' class="sub"' + ">" + "(optional)" + "</span>");
                    __.line = 124, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 125, __.col = 17;
                    __.push("<textarea" + ">" + "</textarea>" + "</div>" + "</div>" + "</div>");
                    __.line = 126, __.col = 11;
                    __.push("<div" + ' class="buttons"' + ">");
                    __.line = 127, __.col = 13;
                    __.push("<button" + ' class="submit"' + ">" + "Attach" + "</button>");
                    __.line = 128, __.col = 13;
                    __.push("<a" + ' href="#cancel"' + ' class="cancel"' + ">" + "Cancel" + "</a>" + "</div>" + "</form>" + "</div>");
                    __.line = 130, __.col = 7;
                    __.push("<div" + ' id="Page"' + ' class="create"' + ">");
                    __.line = 131, __.col = 9;
                    __.push("<form" + ' method="POST"');
                    __.r.attrs({
                        action: {
                            v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/folder/" + __.r.escape((__.z = folder_num) == null ? "" : __.z) + "/page",
                            e: 1
                        }
                    }, __);
                    __.push(">");
                    __.line = 132, __.col = 11;
                    __.push("<div" + ' class="fields"' + ">");
                    __.line = 133, __.col = 13;
                    __.push("<div" + ' class="field title"' + ">");
                    __.line = 134, __.col = 15;
                    __.push("<label" + ">" + "Title:" + "</label>");
                    __.line = 135, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 136, __.col = 17;
                    __.push("<input" + ' type="text"' + ' name="title"' + ' class="field"');
                    __.r.attrs({
                        value: {
                            v: undefined,
                            e: 1
                        }
                    }, __);
                    __.push("/>" + "</div>" + "</div>" + "</div>");
                    __.line = 137, __.col = 11;
                    __.push("<div" + ' class="buttons"' + ">");
                    __.line = 138, __.col = 13;
                    __.push("<input" + ' type="hidden"' + ' name="stuff_type"' + ' value="page"' + "/>");
                    __.line = 139, __.col = 13;
                    __.r.call("applet", {}, __, "as_this_life");
                    __.line = 140, __.col = 13;
                    __.push("<button" + ' class="submit"' + ">" + "Create" + "</button>" + "</div>" + "</form>" + "</div>");
                    __.line = 142, __.col = 7;
                    __.push("<div" + ' id="Quote"' + ' class="create"' + ">");
                    __.line = 143, __.col = 9;
                    __.push("<form" + ' method="POST"');
                    __.r.attrs({
                        action: {
                            v: "/folder/" + __.r.escape((__.z = folder_num) == null ? "" : __.z) + "/attach_quote",
                            e: 1
                        }
                    }, __);
                    __.push(">");
                    __.line = 144, __.col = 11;
                    __.push("<div" + ' class="fields"' + ">");
                    __.line = 145, __.col = 13;
                    __.push("<div" + ' class="field body"' + ">");
                    __.line = 146, __.col = 15;
                    __.push("<label" + ">" + "body:" + "</label>");
                    __.line = 147, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 148, __.col = 17;
                    __.push("<textarea" + ' name="body"' + ">" + "</textarea>" + "</div>" + "</div>");
                    __.line = 149, __.col = 13;
                    __.push("<div" + ' class="field by"' + ">");
                    __.line = 150, __.col = 15;
                    __.push("<label" + ">" + "Author:" + "</label>");
                    __.line = 151, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 152, __.col = 17;
                    __.push("<textarea" + ' name="by"' + ">" + "</textarea>" + "</div>" + "</div>" + "</div>");
                    __.line = 153, __.col = 11;
                    __.push("<div" + ' class="buttons"' + ">");
                    __.line = 154, __.col = 13;
                    __.push("<button" + ' class="submit"' + ">" + "Attach" + "</button>");
                    __.line = 155, __.col = 13;
                    __.push("<a" + ' href="#cancel"' + ' class="cancel"' + ">" + "Cancel" + "</a>" + "</div>" + "</form>" + "</div>");
                    __.line = 157, __.col = 7;
                    __.push("<div" + ' id="Person"' + ' class="create"' + ">");
                    __.line = 158, __.col = 9;
                    __.push("<form" + ' method="POST"');
                    __.r.attrs({
                        action: {
                            v: "/folder/" + __.r.escape((__.z = folder_num) == null ? "" : __.z) + "/attach_person",
                            e: 1
                        }
                    }, __);
                    __.push(">");
                    __.line = 159, __.col = 11;
                    __.push("<div" + ' class="fields"' + ">");
                    __.line = 160, __.col = 13;
                    __.push("<div" + ' class="field first_name"' + ">");
                    __.line = 161, __.col = 15;
                    __.push("<label" + ">" + "First Name:" + "</label>");
                    __.line = 162, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 163, __.col = 17;
                    __.push("<input" + ' type="text"' + ' name="first_name"' + ' class="field"');
                    __.r.attrs({
                        value: {
                            v: undefined,
                            e: 1
                        }
                    }, __);
                    __.push("/>" + "</div>" + "</div>");
                    __.line = 164, __.col = 13;
                    __.push("<div" + ' class="field last_name"' + ">");
                    __.line = 165, __.col = 15;
                    __.push("<label" + ">" + "Last Name:" + "</label>");
                    __.line = 166, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 167, __.col = 17;
                    __.push("<input" + ' type="text"' + ' name="last_name"' + ' class="field"');
                    __.r.attrs({
                        value: {
                            v: undefined,
                            e: 1
                        }
                    }, __);
                    __.push("/>" + "</div>" + "</div>");
                    __.line = 168, __.col = 13;
                    __.push("<div" + ' class="field comment"' + ">");
                    __.line = 169, __.col = 15;
                    __.push("<label" + ">" + "Comment:" + "</label>");
                    __.line = 170, __.col = 15;
                    __.push("<div" + ' class="ele"' + ">");
                    __.line = 171, __.col = 17;
                    __.push("<textarea" + ' name="comment"' + ">" + "</textarea>" + "</div>" + "</div>" + "</div>");
                    __.line = 172, __.col = 11;
                    __.push("<div" + ' class="buttons"' + ">");
                    __.line = 173, __.col = 13;
                    __.push("<button" + ' class="submit"' + ">" + "Attach" + "</button>");
                    __.line = 174, __.col = 13;
                    __.push("<a" + ' href="#cancel"' + ' class="cancel"' + ">" + "Cancel" + "</a>" + "</div>" + "</form>" + "</div>" + "</div>");
                }
                __.line = 176, __.col = 3;
                __.push("<div" + ' class="boxs"' + ">");
                __.line = 177, __.col = 5;
                __.push("<div" + ' class="box item"' + ">");
                __.line = 178, __.col = 7;
                __.push("<div" + ' class="content"' + ">");
                __.line = 179, __.col = 9;
                __.push("<div" + ' class="title"' + ">");
                __.line = 180, __.col = 11;
                __.push("Something happened to me last night");
                __.line = 181, __.col = 11;
                __.push("\nwhen I was driving home. I had a couple");
                __.line = 182, __.col = 11;
                __.push("\nof miles to go." + "</div>");
                __.line = 183, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 184, __.col = 11;
                __.push("<a" + ' href="#edit"' + ">" + "Edit" + "</a>" + "</div>" + "</div>" + "</div>" + "</div>");
                __.line = 186, __.col = 3;
                __.push("<div" + ' id="Pages"' + ">");
                __.line = 187, __.col = 5;
                for (var x in pages) {
                    __.line = 188, __.col = 7;
                    __.r.call("draw_page", {}, __, pages[x].data);
                }
                __.push("</div>");
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
