
title 'The Menu for Bots'


section :main do
  mustache 'logged_in?' do
    div.Nav_Bar! {
      a.Go_Home!('Go Back Home', :href=>'/')
    }
  end

  mustache '^bots' do
    div.Empty! %^
      No bots have been created yet. Please come back in
      a few hours.
    ^
  end # === ^bots

  mustache :bots do
    div.bot {
      div.name {
        a("{{screen_name}}", :href=>"{{href}}")
      }
    }
  end # === :bots

end # === section :main

