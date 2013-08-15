local json = require("dkjson")
local dump = require("pl.pretty")
local render
render = function(self)
  return self:html(function()
    return p("h3llo 4")
  end)
end
-- return print(dump.dump(package.loaded))
ngx.say("hello")
