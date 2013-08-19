
package = "okdoki"
version = "0.1-0"
source = {
  url = "http://github.com/da99/okdoki.git",
  tag = "0.1-0",
  dir = "."
}
description = {
  summary = "It's an omnimorph.",
  detailed = [[
    Don't use this. You won't like it.
  ]],
  homepage = "http://github.com/da99/okdoki",
  license = "MIT/X11",
  maintainer = "da99@da99"
}
dependencies = {
  "lua >= 5.1",
  "lapis >= 0.0.1-1",
  "penlight >= 0.1",
  "underscore >= 0.1",
  "rack_jam >= 0.1"
}
build = {
  type = "builtin",
  modules = {
    okdoki = "Server/App/app.lua",
  }
}
