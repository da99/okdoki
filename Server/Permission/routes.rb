
require './Server/Permission/model'

# ============ CREATE ===============================================

post "/Permission" do

  begin
    Permission.create(params)
  rescue Permission::Invalid =>e
    json false, e.msg
  end

end # === post /Permission

# ============ READ =================================================

get "/Permission/:id" do

  begin
    Permission.read(params)
  rescue Permission::Not_Found =>e
    json false, e.msg
  end

end # === get /Permission/:id


# ============ UPDATE ===============================================



# ============ TRASH ================================================



# ============ UNTRASH ==============================================




