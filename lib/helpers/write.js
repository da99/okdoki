
var write = exports.write = {

  plain: function (resp, txt) {
    resp.writeHead(200, { "Content-Type": "text/plain" });
    resp.end(txt);
  }

  , html: function (resp, o, stat) {
    resp.writeHead((stat || 200), { "Content-Type": "text/html" });
    resp.end(o);
  }

  , json: function (resp, o) {
    resp.writeHead(200, { "Content-Type": "application/json" });
    resp.end(JSON.stringify(o));
  }

  , json_success: function (resp, msg, o) {
    if (!o)
      o = {};
    o.msg     = msg;
    o.success = true;
    write.json(resp, o);
  }

  , json_fail: function (resp, msg, stat, o) {
    if (!o)
      o = {};
    o.msg     = msg;
    o.success = false;
    write.json(resp, o, (stat || 404));
  }

};
