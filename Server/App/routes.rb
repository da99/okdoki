get "/" do
  if !request[:user]
    return Fake_Mustache.new('App/top_slash', {
      :title => 'OkDoki.com',
      :YEAR  => Time.now.year
    }).render
  end

  opts = { :user => req.user, :Bots => {:Own => [], :Use => []} }
  Fake_Mustache.new('Customer/lifes', {
    :title => "My Okdoki",
    :Bots  => { :Own => f.data.Bots.Own, :Use => f.data.Bots.Use }
  })
end # === get /

get "/unauthenticated" do
  "Not logged in"
end

