
require './Server/Screen_Name_Code/model'

# ============ CREATE ===============================================

post "/Screen_Name_Code" do

  begin
    Screen_Name_Code.create(params)
  rescue Screen_Name_Code::Invalid =>e
    json false, e.msg
  end

end # === post /Screen_Name_Code

# ============ READ =================================================

get "/Screen_Name_Code/:id" do

  begin
    Screen_Name_Code.read(params)
  rescue Screen_Name_Code::Not_Found =>e
    json false, e.msg
  end

end # === get /Screen_Name_Code/:id


# ============ UPDATE ===============================================



# ============ TRASH ================================================



# ============ UNTRASH ==============================================




