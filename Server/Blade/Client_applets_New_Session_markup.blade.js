function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/New_Session/markup.blade";
    __.source = 'append templates\n  div.sign_in_success\n    | You are now sign-ed in. Go to...\n    a(href="{HREF}") {HREF}\n\n\n\ndiv.box#New_Session\n  h3 Log-In\n  div.content\n    form(id=\'sign_in\', action=\'/sign-in\', method=\'post\')\n      div.fields\n        div.field.screen_name\n          label(for="LOGIN_SCREEN_NAME") Screen name:\n          input#LOGIN_SCREEN_NAME.field(type=\'text\', name="screen_name", value="")\n        div.field.passphrase\n          label(for="LOGIN_PASS_PHRASE") Pass phrase:\n          input#LOGIN_PASS_PHRASE.field(type=\'password\', name="pass_phrase", value="")\n        div.field.buttons\n          button.submit Log-In\n\n';
    try {
        with (__.locals) {
            __.line = 1, __.col = 1;
            __.r.blockMod("a", "templates", __, function(__) {
                __.line = 2, __.col = 3;
                __.push("<div" + ' class="sign_in_success"' + ">");
                __.line = 3, __.col = 5;
                __.push("You are now sign-ed in. Go to...");
                __.line = 4, __.col = 5;
                __.push("<a" + ' href="{HREF}"' + ">" + "{HREF}" + "</a>" + "</div>");
            });
            __.line = 8, __.col = 1;
            __.push("<div" + ' id="New_Session"' + ' class="box"' + ">");
            __.line = 9, __.col = 3;
            __.push("<h3" + ">" + "Log-In" + "</h3>");
            __.line = 10, __.col = 3;
            __.push("<div" + ' class="content"' + ">");
            __.line = 11, __.col = 5;
            __.push("<form" + ' id="sign_in"' + ' action="/sign-in"' + ' method="post"' + ">");
            __.line = 12, __.col = 7;
            __.push("<div" + ' class="fields"' + ">");
            __.line = 13, __.col = 9;
            __.push("<div" + ' class="field screen_name"' + ">");
            __.line = 14, __.col = 11;
            __.push("<label" + ' for="LOGIN_SCREEN_NAME"' + ">" + "Screen name:" + "</label>");
            __.line = 15, __.col = 11;
            __.push("<input" + ' type="text"' + ' name="screen_name"' + ' id="LOGIN_SCREEN_NAME"' + ' class="field"');
            __.r.attrs({
                value: {
                    v: undefined,
                    e: 1
                }
            }, __);
            __.push("/>" + "</div>");
            __.line = 16, __.col = 9;
            __.push("<div" + ' class="field passphrase"' + ">");
            __.line = 17, __.col = 11;
            __.push("<label" + ' for="LOGIN_PASS_PHRASE"' + ">" + "Pass phrase:" + "</label>");
            __.line = 18, __.col = 11;
            __.push("<input" + ' type="password"' + ' name="pass_phrase"' + ' id="LOGIN_PASS_PHRASE"' + ' class="field"');
            __.r.attrs({
                value: {
                    v: undefined,
                    e: 1
                }
            }, __);
            __.push("/>" + "</div>");
            __.line = 19, __.col = 9;
            __.push("<div" + ' class="field buttons"' + ">");
            __.line = 20, __.col = 11;
            __.push("<button" + ' class="submit"' + ">" + "Log-In" + "</button>" + "</div>" + "</div>" + "</form>" + "</div>" + "</div>");
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
