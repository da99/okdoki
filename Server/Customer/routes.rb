
require './Server/Customer/model'

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

post '/settings/list' do
  json true, MultiJson.dump([
    'draw settings box', ["rss_news_wire", "RSS News Wire"],
    'is on', [],
    'is genius', []
  ])
end
