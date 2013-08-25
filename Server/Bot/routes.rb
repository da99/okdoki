
require './Server/Bot/model'

# ============ CREATE ===============================================

post '/Bot' do
  data = {sub_sn: req.body.sub_sn, as_this_life: req.body.as_this_life, user: req.user}
  begin
    b = Bot.create(data)
    json true, "Bot created: #{b.screen_name}", bot: b.to_public
  rescue Bot::Invalid => e
    json false, e.msg
  end
end # === post /Bot


# ============ READ =================================================

get '/Bot/:screen_name' do

  sn = params[:screen_name]

  begin
    bot = Bot.read_by_screen_name(sn).to_public
    render 'Bot/bot', {
      bot: bot,
      title: bot.screen_name,
      Bot_Code: bot.code
    }
  rescue Bot::Invalid => e
    pass
  end

end # === get /Bot/:screen_name


get '/bots/for/:screen_name' do
  list = Bot.read_list_to_run(params[:screen_name])
  json true, "List read.", bots: list
end

get "/Bot/:id" do
  begin
    Bot.read(params)
  rescue Bot::Not_Found =>e
    json false, e.msg
  end
end # === get /Bot/:id



# ============ UPDATE ===============================================


put '/Bot' do
  bot = Bot.update({
    sub_sn: request.body[:sub_sn],
    owner: reqest.body[:as_this_life],
    code: reqest.body[:code]
  })

  json true, "Update successful.", bot: bot.to_public
end

put '/Bot/Code' do
  begin
    Bot.update aud: request[:user], data: request.body
  rescue Bot::Invalid => e
    json false, e.msg
  end
end




