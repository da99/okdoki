function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.base = "/home/da/DEV/apps/okdoki";
    __.rel = "Client";
    __.filename = "/home/da/DEV/apps/okdoki/Client/layout.blade";
    __.source = '!!! 5\nhtml(lang=\'en\')\n\n  function on_off(val, show_more)\n    - var _class = (!val || val === \'off\') ? \'off\' : \'on\'\n    span(class="on_off #{_class}")\n      a.on(href="#on") On\n      a.off(href="#off") Off\n      - if (show_more)\n        a.show_more(href="#more_settings") Settings\n\n  function span_as()\n    span.as_this_life\n      span.as as:&nbsp;\n      call as_this_life_menu()\n\n  function as_this_life_menu()\n    select(name="as_this_life")\n      - for (var x in customer_screen_names)\n        option(value="#{customer_screen_names[x]}") #{customer_screen_names[x]}\n\n  function script(name)\n    script(src="#{add_mtime(name)}")\n\n  function applet(name)\n    - var blade_file = "../../applets/" + name + "/markup.blade"\n    - var js_file    = "/applets/" + name + "/script.js"\n    - var css_file   = "/applets/" + name + "/style.css"\n    include blade_file\n    append styles\n      call css(css_file)\n    append scripts\n      call script(js_file)\n\n  function css(name)\n    link(href="#{add_mtime(name)}", rel=\'stylesheet\', media=\'screen\', type="text/css")\n\n  head\n\n    title= title\n    meta(http-equiv="Content-Type", content="text/html charet=UTF-8" )\n    meta(http-equiv="Cache-Control", content="no-cache, max-age=0, must-revalidate, no-store, max-stale=0, post-check=0, pre-check=0" )\n\n    link(rel=\'shortcut icon\', href=\'/favicon.ico\')\n    call css("/css/lenka-stabilo.css")\n    call css("/css/circus.css")\n\n    call css(\'/css/vanilla.reset.css\')\n    call css("/css/okdoki.css")\n    call css("/css/forms.css")\n\n    block styles\n\n    call css("/" + template_name + "/style.css")\n\n  body(class="#{ (is_customer) ? \'is_customer\' : \'is_stranger\' }")\n\n    - if (is_customer)\n      div#Session_Nav\n        block Session_Nav\n        - if (!is_top_slash)\n          a#Top_Slassh(href="/") My Account\n        a#Log_Out(href="/log-out") Log-out\n\n    block content\n    block footer\n    block other\n\n    script(type="text/_csrf", id="_csrf")\n      | #{_csrf}\n\n\n    script#Meta_Box(type="text/x-okdoki")\n      - if (screen_name)\n        div.Screen_Name\n          | #{screen_name}\n\n      - if (is_customer)\n        div.Customer_Screen_Names\n          | #{customer_screen_names.join(\' \')}\n\n      block Meta_Box\n\n\n    script#templates(type="text/x-okdoki")\n      div.loading\n        | {msg}\n      div.success\n        | {msg}\n      div.errors\n        | {msg}\n\n      - if (is_customer)\n        span.as_this_life\n          span.as as: \n          call as_this_life_menu()\n\n      block templates\n\n\n\n    - if (is_testing)\n      call script(\'/akui_tests/window.onerror.js\')\n\n    call script(\'/js/vendor/all.js\')\n\n    call script("/js/Common.js")\n    call script("/js/Box.js")\n    call script("/js/Event.js")\n    call script("/js/DOM.js")\n    call script("/js/Ajax.js")\n    call script("/js/Adaptive.js")\n    call script("/js/Time.js")\n    call script("/js/Template.js")\n    call script("/js/Form.js")\n\n    call script("/js/Screen_Name.js")\n    call script("/js/Customer.js")\n\n    block scripts\n\n    - var script_file = "/" + template_name + "/script.js";\n    call script(script_file)\n\n\n\n\n';
    try {
        with (__.locals) {
            __.push("<!DOCTYPE html>");
            __.line = 2, __.col = 1;
            __.push("<html" + ' lang="en"' + ">");
            __.line = 4, __.col = 3;
            __.r.func("on_off", function(__, val, show_more) {
                __.line = 5, __.col = 5;
                var _class = !val || val === "off" ? "off" : "on";
                __.line = 6, __.col = 5;
                __.push("<span");
                __.r.attrs({
                    "class": {
                        v: "on_off " + __.r.escape((__.z = _class) == null ? "" : __.z) + "",
                        e: 1
                    }
                }, __);
                __.push(">");
                __.line = 7, __.col = 7;
                __.push("<a" + ' href="#on"' + ' class="on"' + ">" + "On" + "</a>");
                __.line = 8, __.col = 7;
                __.push("<a" + ' href="#off"' + ' class="off"' + ">" + "Off" + "</a>");
                __.line = 9, __.col = 7;
                if (show_more) {
                    __.line = 10, __.col = 9;
                    __.push("<a" + ' href="#more_settings"' + ' class="show_more"' + ">" + "Settings" + "</a>");
                }
                __.push("</span>");
            }, __);
            __.line = 12, __.col = 3;
            __.r.func("span_as", function(__) {
                __.line = 13, __.col = 5;
                __.push("<span");
                __.r.attrs({
                    id: {
                        v: this.id
                    },
                    "class": {
                        v: this.classes,
                        a: "as_this_life"
                    }
                }, __);
                __.push(">");
                __.line = 14, __.col = 7;
                __.push("<span" + ' class="as"' + ">" + "as:&nbsp;" + "</span>");
                __.line = 15, __.col = 7;
                __.r.call("as_this_life_menu", {}, __);
                __.push("</span>");
            }, __);
            __.line = 17, __.col = 3;
            __.r.func("as_this_life_menu", function(__) {
                __.line = 18, __.col = 5;
                __.push("<select" + ' name="as_this_life"');
                __.r.attrs({
                    id: {
                        v: this.id
                    },
                    "class": {
                        v: this.classes
                    }
                }, __);
                __.push(">");
                __.line = 19, __.col = 7;
                for (var x in customer_screen_names) {
                    __.line = 20, __.col = 9;
                    __.push("<option");
                    __.r.attrs({
                        value: {
                            v: "" + __.r.escape((__.z = customer_screen_names[x]) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push(">" + __.r.escape("" + __.r.escape((__.z = customer_screen_names[x]) == null ? "" : __.z) + "") + "</option>");
                }
                __.push("</select>");
            }, __);
            __.line = 22, __.col = 3;
            __.r.func("script", function(__, name) {
                __.line = 23, __.col = 5;
                __.push("<script");
                __.r.attrs({
                    src: {
                        v: "" + __.r.escape((__.z = add_mtime(name)) == null ? "" : __.z) + "",
                        e: 1
                    },
                    id: {
                        v: this.id
                    },
                    "class": {
                        v: this.classes
                    }
                }, __);
                __.push(">" + "</script>");
            }, __);
            __.line = 25, __.col = 3;
            __.r.func("applet", function(__, name) {
                __.line = 26, __.col = 5;
                var blade_file = "../../applets/" + name + "/markup.blade";
                __.line = 27, __.col = 5;
                var js_file = "/applets/" + name + "/script.js";
                __.line = 28, __.col = 5;
                var css_file = "/applets/" + name + "/style.css";
                __.line = 29, __.col = 5;
                __.r.include(blade_file, __);
                __.line = 30, __.col = 5;
                __.r.blockMod("a", "styles", __, function(__) {
                    __.line = 31, __.col = 7;
                    __.r.call("css", {}, __, css_file);
                });
                __.line = 32, __.col = 5;
                __.r.blockMod("a", "scripts", __, function(__) {
                    __.line = 33, __.col = 7;
                    __.r.call("script", {}, __, js_file);
                });
            }, __);
            __.line = 35, __.col = 3;
            __.r.func("css", function(__, name) {
                __.line = 36, __.col = 5;
                __.push("<link" + ' rel="stylesheet"' + ' media="screen"' + ' type="text/css"');
                __.r.attrs({
                    href: {
                        v: "" + __.r.escape((__.z = add_mtime(name)) == null ? "" : __.z) + "",
                        e: 1
                    },
                    id: {
                        v: this.id
                    },
                    "class": {
                        v: this.classes
                    }
                }, __);
                __.push("/>");
            }, __);
            __.line = 38, __.col = 3;
            __.push("<head" + ">");
            __.line = 40, __.col = 5;
            __.push("<title" + ">" + __.r.escape(title) + "</title>");
            __.line = 41, __.col = 5;
            __.push("<meta" + ' http-equiv="Content-Type"' + ' content="text/html charet=UTF-8"' + "/>");
            __.line = 42, __.col = 5;
            __.push("<meta" + ' http-equiv="Cache-Control"' + ' content="no-cache, max-age=0, must-revalidate, no-store, max-stale=0, post-check=0, pre-check=0"' + "/>");
            __.line = 44, __.col = 5;
            __.push("<link" + ' rel="shortcut icon"' + ' href="/favicon.ico"' + "/>");
            __.line = 45, __.col = 5;
            __.r.call("css", {}, __, "/css/lenka-stabilo.css");
            __.line = 46, __.col = 5;
            __.r.call("css", {}, __, "/css/circus.css");
            __.line = 48, __.col = 5;
            __.r.call("css", {}, __, "/css/vanilla.reset.css");
            __.line = 49, __.col = 5;
            __.r.call("css", {}, __, "/css/okdoki.css");
            __.line = 50, __.col = 5;
            __.r.call("css", {}, __, "/css/forms.css");
            __.line = 52, __.col = 5;
            __.r.blockDef("styles", __, function(__) {});
            __.line = 54, __.col = 5;
            __.r.call("css", {}, __, "/" + template_name + "/style.css");
            __.push("</head>");
            __.line = 56, __.col = 3;
            __.push("<body");
            __.r.attrs({
                "class": {
                    v: "" + __.r.escape((__.z = is_customer ? "is_customer" : "is_stranger") == null ? "" : __.z) + "",
                    e: 1
                }
            }, __);
            __.push(">");
            __.line = 58, __.col = 5;
            if (is_customer) {
                __.line = 59, __.col = 7;
                __.push("<div" + ' id="Session_Nav"' + ">");
                __.line = 60, __.col = 9;
                __.r.blockDef("Session_Nav", __, function(__) {});
                __.line = 61, __.col = 9;
                if (!is_top_slash) {
                    __.line = 62, __.col = 11;
                    __.push("<a" + ' href="/"' + ' id="Top_Slassh"' + ">" + "My Account" + "</a>");
                }
                __.line = 63, __.col = 9;
                __.push("<a" + ' href="/log-out"' + ' id="Log_Out"' + ">" + "Log-out" + "</a>" + "</div>");
            }
            __.line = 65, __.col = 5;
            __.r.blockDef("content", __, function(__) {});
            __.line = 66, __.col = 5;
            __.r.blockDef("footer", __, function(__) {});
            __.line = 67, __.col = 5;
            __.r.blockDef("other", __, function(__) {});
            __.line = 69, __.col = 5;
            __.push("<script" + ' type="text/_csrf"' + ' id="_csrf"' + ">");
            __.line = 70, __.col = 7;
            __.push(__.r.escape("" + __.r.escape((__.z = _csrf) == null ? "" : __.z) + "") + "</script>");
            __.line = 73, __.col = 5;
            __.push("<script" + ' type="text/x-okdoki"' + ' id="Meta_Box"' + ">");
            __.line = 74, __.col = 7;
            if (screen_name) {
                __.line = 75, __.col = 9;
                __.push("<div" + ' class="Screen_Name"' + ">");
                __.line = 76, __.col = 11;
                __.push(__.r.escape("" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "") + "</div>");
            }
            if (is_customer) {
                __.line = 79, __.col = 9;
                __.push("<div" + ' class="Customer_Screen_Names"' + ">");
                __.line = 80, __.col = 11;
                __.push(__.r.escape("" + __.r.escape((__.z = customer_screen_names.join(" ")) == null ? "" : __.z) + "") + "</div>");
            }
            __.line = 82, __.col = 7;
            __.r.blockDef("Meta_Box", __, function(__) {});
            __.push("</script>");
            __.line = 85, __.col = 5;
            __.push("<script" + ' type="text/x-okdoki"' + ' id="templates"' + ">");
            __.line = 86, __.col = 7;
            __.push("<div" + ' class="loading"' + ">");
            __.line = 87, __.col = 9;
            __.push("{msg}" + "</div>");
            __.line = 88, __.col = 7;
            __.push("<div" + ' class="success"' + ">");
            __.line = 89, __.col = 9;
            __.push("{msg}" + "</div>");
            __.line = 90, __.col = 7;
            __.push("<div" + ' class="errors"' + ">");
            __.line = 91, __.col = 9;
            __.push("{msg}" + "</div>");
            __.line = 93, __.col = 7;
            if (is_customer) {
                __.line = 94, __.col = 9;
                __.push("<span" + ' class="as_this_life"' + ">");
                __.line = 95, __.col = 11;
                __.push("<span" + ' class="as"' + ">" + "as: " + "</span>");
                __.line = 96, __.col = 11;
                __.r.call("as_this_life_menu", {}, __);
                __.push("</span>");
            }
            __.line = 98, __.col = 7;
            __.r.blockDef("templates", __, function(__) {});
            __.push("</script>");
            __.line = 102, __.col = 5;
            if (is_testing) {
                __.line = 103, __.col = 7;
                __.r.call("script", {}, __, "/akui_tests/window.onerror.js");
            }
            __.line = 105, __.col = 5;
            __.r.call("script", {}, __, "/js/vendor/all.js");
            __.line = 107, __.col = 5;
            __.r.call("script", {}, __, "/js/Common.js");
            __.line = 108, __.col = 5;
            __.r.call("script", {}, __, "/js/Box.js");
            __.line = 109, __.col = 5;
            __.r.call("script", {}, __, "/js/Event.js");
            __.line = 110, __.col = 5;
            __.r.call("script", {}, __, "/js/DOM.js");
            __.line = 111, __.col = 5;
            __.r.call("script", {}, __, "/js/Ajax.js");
            __.line = 112, __.col = 5;
            __.r.call("script", {}, __, "/js/Adaptive.js");
            __.line = 113, __.col = 5;
            __.r.call("script", {}, __, "/js/Time.js");
            __.line = 114, __.col = 5;
            __.r.call("script", {}, __, "/js/Template.js");
            __.line = 115, __.col = 5;
            __.r.call("script", {}, __, "/js/Form.js");
            __.line = 117, __.col = 5;
            __.r.call("script", {}, __, "/js/Screen_Name.js");
            __.line = 118, __.col = 5;
            __.r.call("script", {}, __, "/js/Customer.js");
            __.line = 120, __.col = 5;
            __.r.blockDef("scripts", __, function(__) {});
            __.line = 122, __.col = 5;
            var script_file = "/" + template_name + "/script.js";
            __.line = 123, __.col = 5;
            __.r.call("script", {}, __, script_file);
            __.push("</body>" + "</html>");
        }
    } catch (e) {
        return cb(__.r.rethrow(e, __));
    }
    if (!__.inc) __.r.done(__);
    __.bd = 1;
    cb(null, __.join(""), __);
}
var runtime = require('./runtime');
var blade = runtime.blade;
exports.render = anonymous;
