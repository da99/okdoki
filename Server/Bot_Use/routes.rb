
require './Server/Bot_Use/model'

# ============ CREATE ===============================================

post "/Bot_Use" do

  begin
    Bot_Use.create(params)
  rescue Bot_Use::Invalid =>e
    json false, e.msg
  end

end # === post /Bot_Use

# ============ READ =================================================

get "/Bot_Use/:id" do

  begin
    Bot_Use.read(params)
  rescue Bot_Use::Not_Found =>e
    json false, e.msg
  end

end # === get /Bot_Use/:id


# ============ UPDATE ===============================================



# ============ TRASH ================================================



# ============ UNTRASH ==============================================




