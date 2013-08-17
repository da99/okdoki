
local ut = require"pl.utils"

-- ngx.say("<htm><body style=\"font-family: Ubuntu, serif; background: #fafafa;color: #EB57A3;\">Be right back.</body></html>");
ngx.say(ut.readfile("Public/App/top_slash/markup.html"))
