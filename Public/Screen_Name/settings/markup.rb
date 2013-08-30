
title 'Settings for: {{user.screen_name}}'


section :main do
  div.Nav_Bar! {
    a.Go_Home!('Go Back Home', :href=>'/')
  }

  mustache '^bots' do
    div.empty {
      red_cloth %^
      You have not chosen any bots to use.
      Go chose some bots from the list: "/bots":/bots
      ^
    }
  end # === ^bots

end # === section :main
