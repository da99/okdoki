
json = require "dkjson"
dump = require "pl.pretty"
render = (self) ->
  @html ->
    p "h3llo 4"

print dump.dump(package.loaded)
-- lapis = require "lapis"
-- lapis.serve class extends lapis.Application
--  "/": render
