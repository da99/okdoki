
require './Server/Notify/model'

# ============ CREATE ===============================================

post "/Notify" do

  begin
    Notify.create(params)
  rescue Notify::Invalid =>e
    json false, e.msg
  end

end # === post /Notify

# ============ READ =================================================

get "/Notify/:id" do

  begin
    Notify.read(params)
  rescue Notify::Not_Found =>e
    json false, e.msg
  end

end # === get /Notify/:id


# ============ UPDATE ===============================================



# ============ TRASH ================================================



# ============ UNTRASH ==============================================




