
title '{{title}}'

section :main do

  Nav_Bar!

  div.Me! do

    div.box {
      h3 {
        span "Message Board"
        span.sub "(Low Priority Messages)"
      }
      div.content "No messages so far."
    }

  end # === div.Me!

  div.Sidebar! {

    div.Me_Intro! {
      div.the_life_of "The life of..."
      h3.name         "{{screen_name}}"
    }

    div.box {
      h3 "How to use Okdoki.com:"
      div.content {
        red_cloth %^
          Write a message below.
        ^

        red_cloth %^
          Find some people or publications to follow:
          "official Okdoki lifes":/lifes
        ^

      }
    }

  } # === Sidebar!

end # === section :content

