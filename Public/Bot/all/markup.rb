
title 'The Menu for Bots'


section :main do
  mustache 'logged_in?' do
    div.Nav_Bar! {
      a.Go_Home!('Go Back Home', :href=>'/')
    }
  end

  mustache '^bots' do
    div.empty {
      red_cloth %^
      No bots have been created yet. Please come back in
      a few hours.
      ^
    }
  end # === ^bots

end # === section :main

