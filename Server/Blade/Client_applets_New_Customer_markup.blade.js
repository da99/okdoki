function anonymous(locals, cb, __) {
    __ = __ || [];
    __.r = __.r || blade.Runtime;
    if (!__.func) __.func = {}, __.blocks = {}, __.chunk = {};
    __.locals = locals || {};
    __.filename = "/home/da/DEV/apps/okdoki/Client/applets/New_Customer/markup.blade";
    __.source = '\n\ndiv.box#New_Customer\n  h3 Create a New Account\n  div.content\n    form(id=\'create_account\', action=\'/customer\', method=\'post\')\n      div.fields\n\n        div.field.screen_name\n          label(for="NEW_CUSTOMER_SCREEN_NAME") Screen name:\n          input#NEW_CUSTOMER_SCREEN_NAME.field(type=\'text\', name="screen_name", value="")\n\n        //- div.field.email\n          //- label\n            //- span.main Email:\n            //- span.sub  (in case you forget your password)\n          //- input.field(type=\'text\', name="email", value="work...")\n\n        div.field.pass_phrase\n          label(for="NEW_CUSTOMER_PASS_PHRASE")\n            span.main Pass phrase\n            span.sub  (for better security, use spaces and words)\n            span.main :\n          input#NEW_CUSTOMER_PASS_PHRASE.field(type=\'password\', name="pass_phrase", value="")\n\n        div.field.confirm_pass_phrase\n          label(for="NEW_CUSTOMER_CONFIRM_PASS_PHRASE")\n            span.main Re-type the pass phrase:\n          input.field(type=\'password\', name="confirm_pass_phrase", value="")\n\n\n        div.buttons\n          button.submit Create Account\n\n';
    try {
        with (__.locals) {
            __.line = 3, __.col = 1;
            __.push("<div" + ' id="New_Customer"' + ' class="box"' + ">");
            __.line = 4, __.col = 3;
            __.push("<h3" + ">" + "Create a New Account" + "</h3>");
            __.line = 5, __.col = 3;
            __.push("<div" + ' class="content"' + ">");
            __.line = 6, __.col = 5;
            __.push("<form" + ' id="create_account"' + ' action="/customer"' + ' method="post"' + ">");
            __.line = 7, __.col = 7;
            __.push("<div" + ' class="fields"' + ">");
            __.line = 9, __.col = 9;
            __.push("<div" + ' class="field screen_name"' + ">");
            __.line = 10, __.col = 11;
            __.push("<label" + ' for="NEW_CUSTOMER_SCREEN_NAME"' + ">" + "Screen name:" + "</label>");
            __.line = 11, __.col = 11;
            __.push("<input" + ' type="text"' + ' name="screen_name"' + ' id="NEW_CUSTOMER_SCREEN_NAME"' + ' class="field"');
            __.r.attrs({
                value: {
                    v: undefined,
                    e: 1
                }
            }, __);
            __.push("/>" + "</div>");
            __.line = 13, __.col = 9;
            __.line = 19, __.col = 9;
            __.push("<div" + ' class="field pass_phrase"' + ">");
            __.line = 20, __.col = 11;
            __.push("<label" + ' for="NEW_CUSTOMER_PASS_PHRASE"' + ">");
            __.line = 21, __.col = 13;
            __.push("<span" + ' class="main"' + ">" + "Pass phrase" + "</span>");
            __.line = 22, __.col = 13;
            __.push("<span" + ' class="sub"' + ">" + " (for better security, use spaces and words)" + "</span>");
            __.line = 23, __.col = 13;
            __.push("<span" + ' class="main"' + ">" + ":" + "</span>" + "</label>");
            __.line = 24, __.col = 11;
            __.push("<input" + ' type="password"' + ' name="pass_phrase"' + ' id="NEW_CUSTOMER_PASS_PHRASE"' + ' class="field"');
            __.r.attrs({
                value: {
                    v: undefined,
                    e: 1
                }
            }, __);
            __.push("/>" + "</div>");
            __.line = 26, __.col = 9;
            __.push("<div" + ' class="field confirm_pass_phrase"' + ">");
            __.line = 27, __.col = 11;
            __.push("<label" + ' for="NEW_CUSTOMER_CONFIRM_PASS_PHRASE"' + ">");
            __.line = 28, __.col = 13;
            __.push("<span" + ' class="main"' + ">" + "Re-type the pass phrase:" + "</span>" + "</label>");
            __.line = 29, __.col = 11;
            __.push("<input" + ' type="password"' + ' name="confirm_pass_phrase"' + ' class="field"');
            __.r.attrs({
                value: {
                    v: undefined,
                    e: 1
                }
            }, __);
            __.push("/>" + "</div>");
            __.line = 32, __.col = 9;
            __.push("<div" + ' class="buttons"' + ">");
            __.line = 33, __.col = 11;
            __.push("<button" + ' class="submit"' + ">" + "Create Account" + "</button>" + "</div>" + "</div>" + "</form>" + "</div>" + "</div>");
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
