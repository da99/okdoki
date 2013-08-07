function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/as_this_life/markup.blade";
    __.source = '- if (is_customer)\n  - if (customer_has_one_life)\n    input(type="hidden", name="as_this_life", value="#{customer_screen_names[0]}")\n  - else if (is_owner && screen_name)\n    input(type="hidden", name="as_this_life", value="#{screen_name}")\n  - else\n    div.field.as_this_life\n      span.label As:\n      select\n        - for (var x in customer_screen_names)\n          option(value="#{customer_screen_names[sn]}") #{customer_screen_names[sn]}\n\n';
    try {
        with (__.locals) {
            __.line = 1, __.col = 1;
            if (is_customer) {
                __.line = 2, __.col = 3;
                if (customer_has_one_life) {
                    __.line = 3, __.col = 5;
                    __.push("<input" + ' type="hidden"' + ' name="as_this_life"');
                    __.r.attrs({
                        value: {
                            v: "" + __.r.escape((__.z = customer_screen_names[0]) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push("/>");
                } else if (is_owner && screen_name) {
                    __.line = 5, __.col = 5;
                    __.push("<input" + ' type="hidden"' + ' name="as_this_life"');
                    __.r.attrs({
                        value: {
                            v: "" + __.r.escape((__.z = screen_name) == null ? "" : __.z) + "",
                            e: 1
                        }
                    }, __);
                    __.push("/>");
                } else {
                    __.line = 7, __.col = 5;
                    __.push("<div" + ' class="field as_this_life"' + ">");
                    __.line = 8, __.col = 7;
                    __.push("<span" + ' class="label"' + ">" + "As:" + "</span>");
                    __.line = 9, __.col = 7;
                    __.push("<select" + ">");
                    __.line = 10, __.col = 9;
                    for (var x in customer_screen_names) {
                        __.line = 11, __.col = 11;
                        __.push("<option");
                        __.r.attrs({
                            value: {
                                v: "" + __.r.escape((__.z = customer_screen_names[sn]) == null ? "" : __.z) + "",
                                e: 1
                            }
                        }, __);
                        __.push(">" + __.r.escape("" + __.r.escape((__.z = customer_screen_names[sn]) == null ? "" : __.z) + "") + "</option>");
                    }
                    __.push("</select>" + "</div>");
                }
            }
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
