
def folder(f)
  li.folder {
    a.open('{name}', href: "/me/{screen_name}/folder/{f.num}")
  }
end

title '{{title}}'
applet("Bot_Create")

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
      div.the_life_of "The life of..."
      h3.name "{{screen_name.screen_name}}"
    }

    div.box {
      h3 "~ ~ ~"
      div.content "* * *"
    }

    div.Options! {
      h2 "Options for Eggheads"
      section :Bot_Create
    }

  }

end # === section :content

