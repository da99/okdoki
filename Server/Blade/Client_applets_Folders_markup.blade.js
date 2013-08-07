function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/Folders/markup.blade";
    __.source = 'div.box#OLD_Create_Folder\n  h3 Create a new folder:\n  div.content\n    form(action="/me/#{screen_name}/create/folder", method="POST")\n      div.fields\n        div.field.title\n          span.label Title:\n          input(type="text", value="", name="title", maxlength="100")\n        div.field.acts_like\n          span.label This new folder will act like a:\n          select\n            option folder (ie I DON\'T CARE).\n            option book.\n            option journal (eg blog).\n            option scrap book (aka pin board).\n            option play activity w/friends.\n            option something serious for co-workers/class mates.\n      div.buttons\n        button.submit Create\n\n//- ===========================================================\ndiv.box#Folders\nh3 Folders:\ndiv.content\n  ul.folders\n    - for (var f in folders)\n      call folder(folders[f].data)\n  - if (is_customer)\n    h3 Create a new folder:\n    form#Create_Folder(action="/me/#{screen_name}/folder", method="POST")\n      div.fields\n        div.field.title\n          span.label Title:\n          input(type="text", name="title", value="", maxlength="100")\n        call applet("as_this_life")\n        div.buttons\n          button.submit Create\n\n\n';
    try {
        with (__.locals) {
            __.line = 1, __.col = 1;
            __.push("<div" + ' id="OLD_Create_Folder"' + ' class="box"' + ">");
            __.line = 2, __.col = 3;
            __.push("<h3" + ">" + "Create a new folder:" + "</h3>");
            __.line = 3, __.col = 3;
            __.push("<div" + ' class="content"' + ">");
            __.line = 4, __.col = 5;
            __.push("<form" + ' method="POST"');
            __.r.attrs({
                action: {
                    v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/create/folder",
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
            __.push("/>" + "</div>");
            __.line = 9, __.col = 9;
            __.push("<div" + ' class="field acts_like"' + ">");
            __.line = 10, __.col = 11;
            __.push("<span" + ' class="label"' + ">" + "This new folder will act like a:" + "</span>");
            __.line = 11, __.col = 11;
            __.push("<select" + ">");
            __.line = 12, __.col = 13;
            __.push("<option" + ">" + "folder (ie I DON'T CARE)." + "</option>");
            __.line = 13, __.col = 13;
            __.push("<option" + ">" + "book." + "</option>");
            __.line = 14, __.col = 13;
            __.push("<option" + ">" + "journal (eg blog)." + "</option>");
            __.line = 15, __.col = 13;
            __.push("<option" + ">" + "scrap book (aka pin board)." + "</option>");
            __.line = 16, __.col = 13;
            __.push("<option" + ">" + "play activity w/friends." + "</option>");
            __.line = 17, __.col = 13;
            __.push("<option" + ">" + "something serious for co-workers/class mates." + "</option>" + "</select>" + "</div>" + "</div>");
            __.line = 18, __.col = 7;
            __.push("<div" + ' class="buttons"' + ">");
            __.line = 19, __.col = 9;
            __.push("<button" + ' class="submit"' + ">" + "Create" + "</button>" + "</div>" + "</form>" + "</div>" + "</div>");
            __.line = 21, __.col = 1;
            __.line = 22, __.col = 1;
            __.push("<div" + ' id="Folders"' + ' class="box"' + ">" + "</div>");
            __.line = 23, __.col = 1;
            __.push("<h3" + ">" + "Folders:" + "</h3>");
            __.line = 24, __.col = 1;
            __.push("<div" + ' class="content"' + ">");
            __.line = 25, __.col = 3;
            __.push("<ul" + ' class="folders"' + ">");
            __.line = 26, __.col = 5;
            for (var f in folders) {
                __.line = 27, __.col = 7;
                __.r.call("folder", {}, __, folders[f].data);
            }
            __.push("</ul>");
            __.line = 28, __.col = 3;
            if (is_customer) {
                __.line = 29, __.col = 5;
                __.push("<h3" + ">" + "Create a new folder:" + "</h3>");
                __.line = 30, __.col = 5;
                __.push("<form" + ' method="POST"' + ' id="Create_Folder"');
                __.r.attrs({
                    action: {
                        v: "/me/" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "/folder",
                        e: 1
                    }
                }, __);
                __.push(">");
                __.line = 31, __.col = 7;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 32, __.col = 9;
                __.push("<div" + ' class="field title"' + ">");
                __.line = 33, __.col = 11;
                __.push("<span" + ' class="label"' + ">" + "Title:" + "</span>");
                __.line = 34, __.col = 11;
                __.push("<input" + ' type="text"' + ' name="title"' + ' maxlength="100"');
                __.r.attrs({
                    value: {
                        v: undefined,
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>");
                __.line = 35, __.col = 9;
                __.r.call("applet", {}, __, "as_this_life");
                __.line = 36, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 37, __.col = 11;
                __.push("<button" + ' class="submit"' + ">" + "Create" + "</button>" + "</div>" + "</div>" + "</form>");
            }
            __.push("</div>");
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
