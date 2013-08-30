


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

get "/settings" do
  return redirect(to('/'), 302) unless logged_in?

  html "Screen_Name/settings", {
    :msg => 'hello',
    :user => user.to_public
  }
end # === get /settings
