
# =====================================================
# Create
# =====================================================

post '/user' do
  begin
    args = params.dup
    args[:ip] = env['HTTP_X_REAL_IP']
    c = Customer.create(args)
    sign_in(c)
    json(
      true,
      :msg      => "Account created. Please wait as page is re-loaded...",
      :location => c.screen_names.first.to_href
    )
  rescue Screen_Name::Dup => err
    json false, err.msg
  rescue Customer::Invalid => err
    json false, err.msg
  end
end # === post Customer

post '/@' do
  begin
    sn   = user.create(:screen_name, params[:screen_name])
    json true, "Your new life has been created: #{sn.screen_name}" , sn.to_public
  rescue Ok::Invalid => e
    json false, e.msg
  end
end # === post

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

get '/@:screen_name' do
  sn = Screen_Name.canonize params[:screen_name]

  if sn != params[:screen_name]
    return redirect(to('/@' + sn), 302)
  end

  begin
    life = Screen_Name.read_by_screen_name(sn)
    html 'Screen_Name/me', {
      :title       => "The life of #{life.screen_name}",
      :screen_name => life.screen_name,
      :is_owner    => logged_in? && user.is?(life)
    }
  rescue Screen_Name::Not_Found => e
    pass
  end

end

post '/Chit_Chat/list' do
  msgs = user.read_chit_chat_list(params[:screen_name]).
    map(&:to_public)

  json true, "still testing", {chit_chat_list: msgs}
end # === post /Chit_Chat/list

# =====================================================
# Update
# =====================================================
