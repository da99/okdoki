get "/" do
  if logged_in?
    opts = { user: nil, Bots: {Own: [], Use: []} }
    html 'Customer/lifes', {
      :title => "My Okdoki",
      :Bots  => { :Own => user.bots, :Use => user.bot_uses }
    }
  else
    return html 'App/top_slash', {
      title: 'OkDoki.com',
      YEAR: Time.now.year,
      _csrf: csrf_token
    }
  end
end # === get /

get "/unauthenticated" do
  "Not logged in"
end

