
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
      :intro       => "The bots of",
      :screen_name => user.screen_names.first.to_public,
      :is_owner    => logged_in?
    }
  else
    html 'App/top_slash', {
      title: 'OkDoki.com',
      YEAR: Time.now.year
    }
  end
end # === get /


# =====================================================
# Update
# =====================================================
