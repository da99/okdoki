
local utils = require("pl.utils")

local config = require("lapis.config").config

config({"development", "production"}, function ()

  local ss = os.getenv("SESSION_SECRET")
  if not ss then
    error("SESSION_SECRET not set")
  end

  secret(ss)
  postgresql_url(os.getenv "DATABASE_URL")

  port(utils.readlines("conf/ports")[1])
end)

config("development", function ()
  code_cache("off")
end)

config("production", function ()
  num_workers(4)
  code_cache("on")
end)

