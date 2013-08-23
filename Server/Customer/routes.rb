
require './Server/Customer/model'

unguard :post, '/Customer' do
  begin
    c = Customer.create(params)
    sign_in(c)
    json(
      true,
      :msg      => "Account created. Please wait as page is re-loaded...",
      :location => c.to_href
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
