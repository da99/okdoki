


get "/" do
  if logged_in?
    html 'Screen_Name/me', {
      :intro       => "The bots of",
      :screen_name => user.to_public,
      :bot_uses    => user.bot_uses(:to_public),
      :is_owner    => logged_in?
    }
  else
    html 'App/top_slash', {
      title: 'OkDoki.com',
      YEAR: Time.now.year
    }
  end
end # === get /


get "/bots" do
  l = user.read_bot_menu(:to_public)
  html "Bot/all", {
    :bots => l
  }
end # === get /bots


__END__


get "/settings" do
  return redirect(to('/'), 302) unless logged_in?

  html "Screen_Name/settings", {
    :msg => 'hello',
    :user => user.to_public,
    :bots => []
  }
end # === get /settings

