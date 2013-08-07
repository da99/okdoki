function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/what_i_done/markup.blade";
    __.source = '\nappend Interact\n  div.box#New_Task\n    h3 Create Task:\n    div.content\n      form#Create_Task(method="POST", action="/what_i_done")\n        div.fields\n          div.field.title\n            label Title:\n            input(name="title", type="text", maxlength="80")\n          div.field.due_at\n            label Due at:\n            select\n              option Yesterday\n              option(selected="selected") Today\n              option Tomorrow\n            select(name="hour")\n              - var i = 0\n              - while(++i < 13)\n                option(value="#{i}") #{i}\n            select(name="minute")\n              - var i = -5\n              - while((i+=5) < 60)\n                - if (i < 10)\n                  option(value="0#{i}") 0#{i}\n                - else\n                  option(value="#{i}") #{i}\n            select(name="am_pm")\n              option(value="am") am\n              option(value="pm") pm\n        div.buttons\n          button.submit Create\n';
    try {
        with (__.locals) {
            __.line = 2, __.col = 1;
            __.r.blockMod("a", "Interact", __, function(__) {
                __.line = 3, __.col = 3;
                __.push("<div" + ' id="New_Task"' + ' class="box"' + ">");
                __.line = 4, __.col = 5;
                __.push("<h3" + ">" + "Create Task:" + "</h3>");
                __.line = 5, __.col = 5;
                __.push("<div" + ' class="content"' + ">");
                __.line = 6, __.col = 7;
                __.push("<form" + ' method="POST"' + ' action="/what_i_done"' + ' id="Create_Task"' + ">");
                __.line = 7, __.col = 9;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 8, __.col = 11;
                __.push("<div" + ' class="field title"' + ">");
                __.line = 9, __.col = 13;
                __.push("<label" + ">" + "Title:" + "</label>");
                __.line = 10, __.col = 13;
                __.push("<input" + ' name="title"' + ' type="text"' + ' maxlength="80"' + "/>" + "</div>");
                __.line = 11, __.col = 11;
                __.push("<div" + ' class="field due_at"' + ">");
                __.line = 12, __.col = 13;
                __.push("<label" + ">" + "Due at:" + "</label>");
                __.line = 13, __.col = 13;
                __.push("<select" + ">");
                __.line = 14, __.col = 15;
                __.push("<option" + ">" + "Yesterday" + "</option>");
                __.line = 15, __.col = 15;
                __.push("<option" + ' selected="selected"' + ">" + "Today" + "</option>");
                __.line = 16, __.col = 15;
                __.push("<option" + ">" + "Tomorrow" + "</option>" + "</select>");
                __.line = 17, __.col = 13;
                __.push("<select" + ' name="hour"' + ">");
                __.line = 18, __.col = 15;
                var i = 0;
                __.line = 19, __.col = 15;
                while (++i < 13) {
                    __.line = 20, __.col = 17;
                    __.push("<option");
                    __.r.attrs({
                        value: {
                            v: "" + __.r.escape((__.z = i) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push(">" + __.r.escape("" + __.r.escape((__.z = i) == null ? "" : __.z) + "") + "</option>");
                }
                __.push("</select>");
                __.line = 21, __.col = 13;
                __.push("<select" + ' name="minute"' + ">");
                __.line = 22, __.col = 15;
                var i = -5;
                __.line = 23, __.col = 15;
                while ((i += 5) < 60) {
                    __.line = 24, __.col = 17;
                    if (i < 10) {
                        __.line = 25, __.col = 19;
                        __.push("<option");
                        __.r.attrs({
                            value: {
                                v: "0" + __.r.escape((__.z = i) == null ? "" : __.z) + "",
                                e: 1
                            }
                        }, __);
                        __.push(">" + __.r.escape("0" + __.r.escape((__.z = i) == null ? "" : __.z) + "") + "</option>");
                    } else {
                        __.line = 27, __.col = 19;
                        __.push("<option");
                        __.r.attrs({
                            value: {
                                v: "" + __.r.escape((__.z = i) == null ? "" : __.z) + "",
                                e: 1
                            }
                        }, __);
                        __.push(">" + __.r.escape("" + __.r.escape((__.z = i) == null ? "" : __.z) + "") + "</option>");
                    }
                }
                __.push("</select>");
                __.line = 28, __.col = 13;
                __.push("<select" + ' name="am_pm"' + ">");
                __.line = 29, __.col = 15;
                __.push("<option" + ' value="am"' + ">" + "am" + "</option>");
                __.line = 30, __.col = 15;
                __.push("<option" + ' value="pm"' + ">" + "pm" + "</option>" + "</select>" + "</div>" + "</div>");
                __.line = 31, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 32, __.col = 11;
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
