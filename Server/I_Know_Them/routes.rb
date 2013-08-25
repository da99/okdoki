
require './Server/I_Know_Them/model'

# ============ CREATE ===============================================

post "/I_Know_Them" do

  begin
    I_Know_Them.create(params)
  rescue I_Know_Them::Invalid =>e
    json false, e.msg
  end

end # === post /I_Know_Them

# ============ READ =================================================

get "/I_Know_Them/:id" do

  begin
    I_Know_Them.read(params)
  rescue I_Know_Them::Not_Found =>e
    json false, e.msg
  end

end # === get /I_Know_Them/:id





