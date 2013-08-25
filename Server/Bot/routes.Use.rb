
# ============ CREATE ===============================================

post '/Bot/Use' do

  begin
    o = Bot::Use.create({
      bot: params[:bot],
      owner: params[:as_this_life]
    })

    json true, "You are now using, #{o.screen_name}, with #{use.owner}."
  rescue Bot::Use::Invalid => e
    json false, e.msg
  end

end # === post /Bot/Use


post "/Bot_Use" do
  sn = Screen_Name.read_by_screen_name(params[:screen_name], request.user)
  o  = Bot_Use.create_by_screen_name(sn, params)
  json true,'Created: ', model: o.to_public
end

# ============ READ =================================================

get "/Bot_Use/:id" do
  render 'Bot_Use/show_one', :title=> "Bot_Use ##{req.params.id}"
end



