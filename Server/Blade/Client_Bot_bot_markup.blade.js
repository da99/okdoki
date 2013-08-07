function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.base = "/home/da/DEV/apps/okdoki";
    __.rel = "Client/Bot/bot";
    __.filename = "/home/da/DEV/apps/okdoki/Client/Bot/bot/markup.blade";
    __.source = 'include "../../layout.blade"\n\nfunction show_settings()\n  a.show_more(href="#show_more") Other settings...\n\nprepend styles\n  call css("/Screen_Name/me/style.css")\n\nappend templates\n\nappend content\n\n  //- ===========================================================\n\n  div#Sidebar\n\n    div#Me_Intro\n      h3.name #{screen_name}\n      div.what_am_i (i\'m a bot)\n\n    div.box#About_Me\n      h3 About me:\n      div.content\n        form#Bot_About_Me_Update(action="/Bot", method="POST")\n          div.fields\n            div.field.about_me\n              textarea(name="about_me") #{bot.about_me}\n          div.buttons\n            input(type="hidden", value="PUT", name="_method")\n            input(type="hidden", value="#{screen_name}", name="screen_name")\n            button.submit Update "About me."\n\n    h2 Code\n\n    div#Code\n\n      - for (var x in Bot_Code.types)\n        - var code_type = Bot_Code.types[x]\n        - var type_in_word = code_type.charAt(0).toUpperCase() + code_type.slice(1)\n        div.box.update_code\n          div.show_more\n            a.show_more(href="#show_more") Show\n            h4.name On #{type_in_word}\n          div.show\n            h3 On #{type_in_word}\n            div.content\n\n              form(id="Bot_Code_#{code_type}", action="/Bot/Code", method="POST")\n                div.fields\n                  div.field.code\n                    textarea(name="code") #{bot.code}\n                div.buttons\n                  input(type="hidden", value="PUT", name="_method")\n                  input(type="hidden", value="#{bot.prefix}", name="sub_sn")\n                  input(type="hidden", value="#{bot.owner}", name="as_this_life")\n                  input(type="hidden", value="#{Bot_Code.types[x]}", name="type")\n                  button.submit Update\n                  a.show_less(href=\'#cancel\') Cancel\n\n  #Options\n    h2 For My Audience\n    - for (var x in customer_screen_names)\n      div.setting\n        call on_off(\'off\', true)\n        span.name #{customer_screen_names[x]}\n        input(type="hidden", value="#{customer_screen_names[x]}", name="as_this_life")\n\n    h2 For My Use\n    div.setting\n      call on_off(\'off\', true)\n      span.name Multi-Life Home\n      form(id="settings_multi_life", action="/bot/settings/multi_life", method="PUT")\n        div.fields\n          div.field\n            label Zip Code:\n            input(type="text", name="zip_code", value="")\n        div.buttons\n          button.submit Submit\n    - for (var x in customer_screen_names)\n      div.setting\n        call on_off("on", true)\n        span.name #{customer_screen_names[x]}\n        input(type="hidden", value="#{customer_screen_names[x]}", name="as_this_life")\n\n\n  //- ===========================================================\n  //- ===========================================================\n\n';
    try {
        with (__.locals) {
            __.line = 1, __.col = 1;
            __.r.include("../../layout.blade", __);
            __.line = 3, __.col = 1;
            __.r.func("show_settings", function(__) {
                __.line = 4, __.col = 3;
                __.push("<a" + ' href="#show_more"');
                __.r.attrs({
                    id: {
                        v: this.id
                    },
                    "class": {
                        v: this.classes,
                        a: "show_more"
                    }
                }, __);
                __.push(">" + "Other settings..." + "</a>");
            }, __);
            __.line = 6, __.col = 1;
            __.r.blockMod("p", "styles", __, function(__) {
                __.line = 7, __.col = 3;
                __.r.call("css", {}, __, "/Screen_Name/me/style.css");
            });
            __.line = 9, __.col = 1;
            __.r.blockMod("a", "templates", __, function(__) {});
            __.line = 11, __.col = 1;
            __.r.blockMod("a", "content", __, function(__) {
                __.line = 13, __.col = 3;
                __.line = 15, __.col = 3;
                __.push("<div" + ' id="Sidebar"' + ">");
                __.line = 17, __.col = 5;
                __.push("<div" + ' id="Me_Intro"' + ">");
                __.line = 18, __.col = 7;
                __.push("<h3" + ' class="name"' + ">" + __.r.escape("" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "") + "</h3>");
                __.line = 19, __.col = 7;
                __.push("<div" + ' class="what_am_i"' + ">" + "(i'm a bot)" + "</div>" + "</div>");
                __.line = 21, __.col = 5;
                __.push("<div" + ' id="About_Me"' + ' class="box"' + ">");
                __.line = 22, __.col = 7;
                __.push("<h3" + ">" + "About me:" + "</h3>");
                __.line = 23, __.col = 7;
                __.push("<div" + ' class="content"' + ">");
                __.line = 24, __.col = 9;
                __.push("<form" + ' action="/Bot"' + ' method="POST"' + ' id="Bot_About_Me_Update"' + ">");
                __.line = 25, __.col = 11;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 26, __.col = 13;
                __.push("<div" + ' class="field about_me"' + ">");
                __.line = 27, __.col = 15;
                __.push("<textarea" + ' name="about_me"' + ">" + __.r.escape("" + __.r.escape((__.z = bot.about_me) == null ? "" : __.z) + "") + "</textarea>" + "</div>" + "</div>");
                __.line = 28, __.col = 11;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 29, __.col = 13;
                __.push("<input" + ' type="hidden"' + ' value="PUT"' + ' name="_method"' + "/>");
                __.line = 30, __.col = 13;
                __.push("<input" + ' type="hidden"' + ' name="screen_name"');
                __.r.attrs({
                    value: {
                        v: "" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "",
                        e: 1
                    }
                }, __);
                __.push("/>");
                __.line = 31, __.col = 13;
                __.push("<button" + ' class="submit"' + ">" + "Update &quot;About me.&quot;" + "</button>" + "</div>" + "</form>" + "</div>" + "</div>");
                __.line = 33, __.col = 5;
                __.push("<h2" + ">" + "Code" + "</h2>");
                __.line = 35, __.col = 5;
                __.push("<div" + ' id="Code"' + ">");
                __.line = 37, __.col = 7;
                for (var x in Bot_Code.types) {
                    __.line = 38, __.col = 9;
                    var code_type = Bot_Code.types[x];
                    __.line = 39, __.col = 9;
                    var type_in_word = code_type.charAt(0).toUpperCase() + code_type.slice(1);
                    __.line = 40, __.col = 9;
                    __.push("<div" + ' class="box update_code"' + ">");
                    __.line = 41, __.col = 11;
                    __.push("<div" + ' class="show_more"' + ">");
                    __.line = 42, __.col = 13;
                    __.push("<a" + ' href="#show_more"' + ' class="show_more"' + ">" + "Show" + "</a>");
                    __.line = 43, __.col = 13;
                    __.push("<h4" + ' class="name"' + ">" + __.r.escape("On " + __.r.escape((__.z = type_in_word) == null ? "" : __.z) + "") + "</h4>" + "</div>");
                    __.line = 44, __.col = 11;
                    __.push("<div" + ' class="show"' + ">");
                    __.line = 45, __.col = 13;
                    __.push("<h3" + ">" + __.r.escape("On " + __.r.escape((__.z = type_in_word) == null ? "" : __.z) + "") + "</h3>");
                    __.line = 46, __.col = 13;
                    __.push("<div" + ' class="content"' + ">");
                    __.line = 48, __.col = 15;
                    __.push("<form" + ' action="/Bot/Code"' + ' method="POST"');
                    __.r.attrs({
                        id: {
                            v: "Bot_Code_" + __.r.escape((__.z = code_type) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push(">");
                    __.line = 49, __.col = 17;
                    __.push("<div" + ' class="fields"' + ">");
                    __.line = 50, __.col = 19;
                    __.push("<div" + ' class="field code"' + ">");
                    __.line = 51, __.col = 21;
                    __.push("<textarea" + ' name="code"' + ">" + __.r.escape("" + __.r.escape((__.z = bot.code) == null ? "" : __.z) + "") + "</textarea>" + "</div>" + "</div>");
                    __.line = 52, __.col = 17;
                    __.push("<div" + ' class="buttons"' + ">");
                    __.line = 53, __.col = 19;
                    __.push("<input" + ' type="hidden"' + ' value="PUT"' + ' name="_method"' + "/>");
                    __.line = 54, __.col = 19;
                    __.push("<input" + ' type="hidden"' + ' name="sub_sn"');
                    __.r.attrs({
                        value: {
                            v: "" + __.r.escape((__.z = bot.prefix) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push("/>");
                    __.line = 55, __.col = 19;
                    __.push("<input" + ' type="hidden"' + ' name="as_this_life"');
                    __.r.attrs({
                        value: {
                            v: "" + __.r.escape((__.z = bot.owner) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push("/>");
                    __.line = 56, __.col = 19;
                    __.push("<input" + ' type="hidden"' + ' name="type"');
                    __.r.attrs({
                        value: {
                            v: "" + __.r.escape((__.z = Bot_Code.types[x]) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push("/>");
                    __.line = 57, __.col = 19;
                    __.push("<button" + ' class="submit"' + ">" + "Update" + "</button>");
                    __.line = 58, __.col = 19;
                    __.push("<a" + ' href="#cancel"' + ' class="show_less"' + ">" + "Cancel" + "</a>" + "</div>" + "</form>" + "</div>" + "</div>" + "</div>");
                }
                __.push("</div>" + "</div>");
                __.line = 60, __.col = 3;
                __.push("<div" + ' id="Options"' + ">");
                __.line = 61, __.col = 5;
                __.push("<h2" + ">" + "For My Audience" + "</h2>");
                __.line = 62, __.col = 5;
                for (var x in customer_screen_names) {
                    __.line = 63, __.col = 7;
                    __.push("<div" + ' class="setting"' + ">");
                    __.line = 64, __.col = 9;
                    __.r.call("on_off", {}, __, "off", true);
                    __.line = 65, __.col = 9;
                    __.push("<span" + ' class="name"' + ">" + __.r.escape("" + __.r.escape((__.z = customer_screen_names[x]) == null ? "" : __.z) + "") + "</span>");
                    __.line = 66, __.col = 9;
                    __.push("<input" + ' type="hidden"' + ' name="as_this_life"');
                    __.r.attrs({
                        value: {
                            v: "" + __.r.escape((__.z = customer_screen_names[x]) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push("/>" + "</div>");
                }
                __.line = 68, __.col = 5;
                __.push("<h2" + ">" + "For My Use" + "</h2>");
                __.line = 69, __.col = 5;
                __.push("<div" + ' class="setting"' + ">");
                __.line = 70, __.col = 7;
                __.r.call("on_off", {}, __, "off", true);
                __.line = 71, __.col = 7;
                __.push("<span" + ' class="name"' + ">" + "Multi-Life Home" + "</span>");
                __.line = 72, __.col = 7;
                __.push("<form" + ' id="settings_multi_life"' + ' action="/bot/settings/multi_life"' + ' method="PUT"' + ">");
                __.line = 73, __.col = 9;
                __.push("<div" + ' class="fields"' + ">");
                __.line = 74, __.col = 11;
                __.push("<div" + ' class="field"' + ">");
                __.line = 75, __.col = 13;
                __.push("<label" + ">" + "Zip Code:" + "</label>");
                __.line = 76, __.col = 13;
                __.push("<input" + ' type="text"' + ' name="zip_code"');
                __.r.attrs({
                    value: {
                        v: undefined,
                        e: 1
                    }
                }, __);
                __.push("/>" + "</div>" + "</div>");
                __.line = 77, __.col = 9;
                __.push("<div" + ' class="buttons"' + ">");
                __.line = 78, __.col = 11;
                __.push("<button" + ' class="submit"' + ">" + "Submit" + "</button>" + "</div>" + "</form>" + "</div>");
                __.line = 79, __.col = 5;
                for (var x in customer_screen_names) {
                    __.line = 80, __.col = 7;
                    __.push("<div" + ' class="setting"' + ">");
                    __.line = 81, __.col = 9;
                    __.r.call("on_off", {}, __, "on", true);
                    __.line = 82, __.col = 9;
                    __.push("<span" + ' class="name"' + ">" + __.r.escape("" + __.r.escape((__.z = customer_screen_names[x]) == null ? "" : __.z) + "") + "</span>");
                    __.line = 83, __.col = 9;
                    __.push("<input" + ' type="hidden"' + ' name="as_this_life"');
                    __.r.attrs({
                        value: {
                            v: "" + __.r.escape((__.z = customer_screen_names[x]) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push("/>" + "</div>");
                }
                __.push("</div>");
                __.line = 86, __.col = 3;
                __.line = 87, __.col = 3;
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
