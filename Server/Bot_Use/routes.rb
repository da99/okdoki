
require './Server/Bot_Use/model'

# ============ CREATE ===============================================

put '/Bot_Use' do
return json(true, "test")
  begin
    bot = params[:bot_screen_name]
    sn  = user.screen_name
    o   = Bot_Use.upsert(
      bot_screen_name: bot,
      screen_name:     sn
    )

    json true, "You are now using, #{bot}, as #{sn}."
  rescue Bot_Use::Invalid => e
    json false, e.msg
  end

end # === post /Bot/Use

# ============ READ =================================================

# get "/Bot_Use/:id" do

  # begin
    # Bot_Use.read(params)
    # render 'Bot_Use/show_one', :title=> "Bot_Use ##{req.params.id}"
  # rescue Bot_Use::Not_Found =>e
    # json false, e.msg
  # end

# end # === get /Bot_Use/:id


# ============ UPDATE ===============================================



# ============ TRASH ================================================



# ============ UNTRASH ==============================================




