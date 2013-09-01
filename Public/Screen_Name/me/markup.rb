
title '{{title}}'

section :js_templates do
  div.screen_name "{{screen_name}}"
end

section :main do

  Nav_Bar!

  div.Me! do

    div.box.Message_Board! {

      h3 {
        span "Message Board"
        span.sub "(Low Priority Messages)"
      }

      div.content {
        div.please_wait.loading {
          span "Loading..."
        }
      }

    } # === div Message_Board!

  end # === div.Me!

  div.Sidebar! {

    div.Me_Intro! {
      div.the_life_of "The life of..."
      h3.name         "{{screen_name}}"
    }

    div.box.New_Chit_Chat! {

      h3 "Post to your message board:"

      div.content {
        form.Create_Chit_Cat!(action: '/Chit_Chat', method: 'POST') {
          div.fields do
            div.field.body { textarea(name: "body", maxlength: "1000") }
            div.field.buttons { button.submit "Send" }
          end # === div.fields
        }
      }

    } # === New_Chit_Chat!

  } # === Sidebar!

end # === section :content

