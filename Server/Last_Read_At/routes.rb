
require './Server/Last_Read_At/model'

# ============ CREATE ===============================================

post "/Last_Read_At" do

  begin
    Last_Read_At.create(params)
  rescue Last_Read_At::Invalid =>e
    json false, e.msg
  end

end # === post /Last_Read_At

# ============ READ =================================================

get "/Last_Read_At/:id" do

  begin
    Last_Read_At.read(params)
  rescue Last_Read_At::Not_Found =>e
    json false, e.msg
  end

end # === get /Last_Read_At/:id


# ============ UPDATE ===============================================



# ============ TRASH ================================================



# ============ UNTRASH ==============================================




