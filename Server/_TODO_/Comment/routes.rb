
require './Server/Comment/model'

# ============ CREATE ===============================================

post "/Comment" do

  begin
    Comment.create(params)
  rescue Comment::Invalid =>e
    json false, e.msg
  end

end # === post /Comment

# ============ READ =================================================

get "/Comment/:id" do

  begin
    Comment.read(params)
  rescue Comment::Not_Found =>e
    json false, e.msg
  end

end # === get /Comment/:id


# ============ UPDATE ===============================================



# ============ TRASH ================================================



# ============ UNTRASH ==============================================




