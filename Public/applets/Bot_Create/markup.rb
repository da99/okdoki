
def_section :Bot_Create

section :Bot_Create do

  div.box.New_Bot!(class:"{{has_bots}}") do
    div.setting { a.on('Show', href:"#show") }

    h3 "Create a Bot"

    div.content do
      div.list {
        text '{{#bots}}'
          a('{{name}}', href:"/bot/{{name}}")
        text '{{/bots}}'
      }

      text '{{#bots}}'
        form.Bot_Create!(action:"/Bot", method:"POST") do
          div.fields {
            div.field.sub_sn {
              label('Screen Name:', 'for'=>"NEW_BOT_SCREEN_NAME")
              input.NEW_BOT_SCREEN_NAME!(name:"sub_sn", type:"text")
            }
          }
          div.buttons {
            span_as()
            button.submit "Create"
          }
        end
      text '{{/bots}}'
    end
  end

end # === section Bot_Create
