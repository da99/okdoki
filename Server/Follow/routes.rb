
require './Server/Follow/model'

# ============ CREATE ===============================================

post "/Follow" do

  begin
    Follow.create(params)
  rescue Follow::Invalid =>e
    json false, e.msg
  end

end # === post /Follow

# ============ READ =================================================

get "/Follow/:id" do

  begin
    Follow.read(params)
  rescue Follow::Not_Found =>e
    json false, e.msg
  end

end # === get /Follow/:id


# ============ UPDATE ===============================================



# ============ TRASH ================================================



# ============ UNTRASH ==============================================




