
local ut = require"pl.utils"
local rack_jam = require("rack_jam")
local The_Rack = rack_jam.new()

The_Rack:GET('/', function(req, resp, env)
  -- ngx.say("<htm><body style=\"font-family: Ubuntu, serif; background: #fafafa;color: #EB57A3;\">Be right back.</body></html>");
  ngx.say(ut.readfile("Public/App/top_slash/markup.html"))
  return ""
end)


The_Rack:GET('/hello', function(req, resp, env)
  -- ngx.say("<htm><body style=\"font-family: Ubuntu, serif; background: #fafafa;color: #EB57A3;\">Be right back.</body></html>");
  ngx.say("Hello: " .. req.PATH_INFO)
  return ""
end)

The_Rack:AFTER(function(req, resp, env)
  -- ngx.say("<htm><body style=\"font-family: Ubuntu, serif; background: #fafafa;color: #EB57A3;\">Be right back.</body></html>");
  ngx.say("NOT FOUND: " .. req.PATH_INFO)
end)

The_Rack:RUN({REQUEST_METHOD=ngx.req.get_method(), PATH_INFO=ngx.var.uri}, {}, {})


