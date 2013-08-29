get "/" do
  if logged_in?
    opts = { user: nil, Bots: {Own: [], Use: []} }

    html 'Customer/lifes', {
      :title        => "My Okdoki",
      :bots         => user.bots,
      :use_bots     => user.bot_uses,
      :screen_names => user.screen_names(:to_public)
    }
  else
    return html 'App/top_slash', {
      title: 'OkDoki.com',
      YEAR: Time.now.year
    }
  end
end # === get /

get "/unauthenticated" do
  "Not logged in"
end

