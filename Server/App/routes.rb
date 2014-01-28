
# =====================================================
# Create
# =====================================================


post '/Chit_Chat' do

  begin
    Chit_Chat.create(params)
  rescue Chit_Chat::Invalid =>e
    json false, e.msg
  end

end # === post /Chit_Chat


# =====================================================
# Read
# =====================================================

get "/" do
  if logged_in?
    html 'Customer/lifes', {
      :intro        => "My Account...",
      :default_sn   => user.screen_names.first.to_public,
      :screen_names => user.screen_names.map(&:to_public),
      :sn_all       => user.screen_names.map(&:screen_name).join(', '),
      :is_owner     => logged_in?
    }
  else
    html 'App/top_slash', {
      title: 'OkDoki.com',
      YEAR: Time.now.year
    }
  end
end # === get /

post '/Chit_Chat/list' do
  msgs = user.read_chit_chat_list(params[:screen_name]).
    map(&:to_public)

  json true, "still testing", {chit_chat_list: msgs}
end # === post /Chit_Chat/list

# =====================================================
# Update
# =====================================================



