
require './Server/Bot/model'

# ============ CREATE ===============================================

post "/Bot" do

  begin
    Bot.create(params)
  rescue Bot::Invalid =>e
    json false, e.msg
  end

end # === post /Bot

# ============ READ =================================================

get "/Bot/:id" do

  begin
    Bot.read(params)
  rescue Bot::Not_Found =>e
    json false, e.msg
  end

end # === get /Bot/:id





