
def folder(f)
  li.folder {
    a.open('{name}', href: "/me/{screen_name}/folder/{f.num}")
  }
end

title '{{intro}} {{screen_name.screen_name}}'

section :js_templates do

  mustache :is_owner do

    # div.customer_screen_names "{{customer_screen_names}}"


    # folder(num: "{num}", title: "{title}")

    div.msg {
      div.meta {
        span.author
        a("{author_screen_name}", href: "/me/{author_screen_name}")
        span.said  "said:"
      }
      div.content "{body}"
    }

    div.msg.me_msg do
      div.meta {
        span.author "{author_screen_name} (me)"
        span.said  "said:"
      }
      div.content "{body}"
    end

    div.msg.chat_msg {
      div.meta {
        span.author "{author_screen_name}"
        span.said  "said:"
      }
      div.content "{body}"
    }

    div.msg.chat_msg.me_chat_msg do
      div.meta {
        span.author "{author_screen_name} (me)"
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

  # //- ===========================================================
  # //- ===========================================================
  # //- ===========================================================
  div.Me! do

    div.box {
      h3 {
        span "Box"
        span.sub "(Mail)"
      }
      div.content "[placeholder]"
    }

  end # === div.Me!

  div.Sidebar! {

    div.Me_Intro! {
      div.the_life_of "{{intro}}..."
      h3.name "{{screen_name.screen_name}}"
    }

    div.box {
      h3 "How to use your Okdoki bots:"
      div.content {
        p! %^
          To turn off your current bots, go to: <a href="/settings">/settings</a>
        ^

        p! %^
          To find more bots to play with: <a href="/bots">/bots</a>
        ^

        p %^
        The first 5 minutes of learning how to use a bot
        are tough. After that, it should be easy to be productive
        and have fun. Hopefully at the same time.
        ^


      }
    }

  }

end # === section :content

