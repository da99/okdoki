
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
      :location => "/"
    )
  rescue Screen_Name::Dup => err
    json false, err.msg
  rescue Customer::Invalid => err
    json false, err.msg
  end
end # === post Customer

# =====================================================
# Read
# =====================================================

get "/" do
  if logged_in?
    html 'Screen_Name/me', {
      :intro        => "The Console of",
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

get "/@:screen_name" do
  Ok::Escape_All.escape "The life of: #{params[:screen_name]}"
end

# =====================================================
# Update
# =====================================================
