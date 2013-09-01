
title '{{intro}} {{sn_all}}'

section :js_templates do

  mustache :is_owner do

    div.customer_screen_names "{{sn_all}}"

    div.msg {
      div.meta {
        span.author
        a("{sn}", href: "{href}")
        span.said  "said:"
      }
      div.content "{body}"
    }

    div.msg.me_msg do
      div.meta {
        span.author "{sn} (me)"
        span.said  "said:"
      }
      div.content "{body}"
    end

    div.msg.chat_msg {
      div.meta {
        span.author "{sn}"
        span.said  "said:"
      }
      div.content "{body}"
    }

    div.msg.chat_msg.me_chat_msg do
      div.meta {
        span.author "{sn} (me)"
        span.said  "said:"
      }
      div.content "{body}"
    end

    div.msg.official.chat_msg {
      div.content "{body}"
    }

    div.msg.official.chat_msg.errors {
      div.content "{body}"
    }

  end # === :is_owner


end # === section :templates

section :main do

  mustache "logged_in?" do
    div.Nav_Bar! {
      a.Log_Out!('Log-out', :href=>'/log-out')
    }
  end

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
      div.the_life_of "{{intro}}..."
      h3.name "{{sn_all}}"
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

        red_cloth %^
          Find some people or publications to follow:
          "official Okdoki lifes":/lifes
        ^

        p "Your home page(s):"
        ul {
          mustache :screen_names do
            li a("{{screen_name}}", :href=>"{{href}}")
          end
        }
      }
    }

  } # === Sidebar!

end # === section :content

