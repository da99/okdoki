
require './Server/Screen_Name_Code_Consume/model'

# ============ CREATE ===============================================

post "/Follow" do

  begin
    Follow.create(params)
  rescue Follow::Invalid =>e
    json false, e.msg
  end

end # === post /Follow

put '/Screen_Name_Code_Consume' do

  begin
    bot = params['bot_screen_name']
    sn  = user.screen_name
    is_on = params['is_on']

    o   = Screen_Name_Code_Consume.upsert(bot, user.id, is_on)

    if is_on
      json true, "You are now using, #{bot}, as #{sn}."
    else
      json true, "You are no longer using, #{bot}, as #{sn}."
    end
  rescue Screen_Name_Code_Consume::Invalid => e
    json false, e.msg
  end

end # === post /Bot/Use

# ============ READ =================================================

get "/Follow/:id" do

  begin
    Follow.read(params)
  rescue Follow::Not_Found =>e
    json false, e.msg
  end

end # === get /Follow/:id

get "/Screen_Name_Code_Consume/:id" do

  begin
    Screen_Name_Code_Consume.read(params)
    render 'Screen_Name_Code_Consume/show_one', :title=> "Screen_Name_Code_Consume ##{req.params.id}"
  rescue Screen_Name_Code_Consume::Not_Found =>e
    json false, e.msg
  end

end # === get /Screen_Name_Code_Consume/:id



# ============ UPDATE ===============================================



# ============ TRASH ================================================



# ============ UNTRASH ==============================================




