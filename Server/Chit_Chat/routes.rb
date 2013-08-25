
require './Server/Chit_Chat/model'

# ============ CREATE ===============================================

post "/Chit_Chat" do

  begin
    Chit_Chat.create(params)
  rescue Chit_Chat::Invalid =>e
    json false, e.msg
  end

end # === post /Chit_Chat

# ============ READ =================================================

get "/Chit_Chat/:id" do

  begin
    Chit_Chat.read(params)
  rescue Chit_Chat::Not_Found =>e
    json false, e.msg
  end

end # === get /Chit_Chat/:id





