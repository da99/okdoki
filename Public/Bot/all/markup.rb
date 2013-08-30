
title 'The Menu for Bots'


section :main do

  mustache 'logged_in?' do
    div.Nav_Bar! {
      a.Go_Home!('Go Back Home', :href=>'/')
    }
  end

div.Sidebar! {

  div.Me_Intro! {
    div.the_life_of "A menu of..."
    h3.name "bots."
  }

  div.box {
    h3 "Intro:"
    div.content {
      red_cloth %^
        Here you can turn off/on various bots.
        Once you are done, go back "home":/ to
        start using them.
      ^.split.join(" ")
    }
  }

} # === Sidebar!

  div.bot_list! do
    mustache :bots do
      div.bot {
        div.header {
          a.on.on_active('on', :href=>"#on")
          a.off.off_active('off', :href=>"#off")
          a.name("{{screen_name}}", :href=>"{{href}}")
        }
      }
    end # === :bots
  end

end # === section :main

