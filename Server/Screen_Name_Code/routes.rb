
require './Server/Bot_Code/model'

# ============ CREATE ===============================================

post "/Bot_Code" do

  begin
    Bot_Code.create(params)
  rescue Bot_Code::Invalid =>e
    json false, e.msg
  end

end # === post /Bot_Code

# ============ READ =================================================

get "/Bot_Code/:id" do

  begin
    Bot_Code.read(params)
  rescue Bot_Code::Not_Found =>e
    json false, e.msg
  end

end # === get /Bot_Code/:id


# ============ UPDATE ===============================================



# ============ TRASH ================================================



# ============ UNTRASH ==============================================




