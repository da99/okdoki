
require './Server/Bot_Use/model'

# ============ CREATE ===============================================

put '/Bot_Use' do

  begin
    bot = params['bot_screen_name']
    sn  = user.screen_name
    is_on = params['is_on']

    o   = Bot_Use.upsert(bot, user.id, is_on)

    if is_on
      json true, "You are now using, #{bot}, as #{sn}."
    else
      json true, "You are no longer using, #{bot}, as #{sn}."
    end
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




