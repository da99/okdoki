

title '{{title}}'

applet("Create_Life")
applet("Bot_Create")

js_templates {
  li.screen_name {
    a.name('', href:'/me/{name}')
  }
}

main  {

  #//- ===========================================================
  div.Logo! {
    span.main "ok"
    span.sub "doki"
    span.wat_wat ": Multi-Life Chat & Publishing"
  }

  # //- ===========================================================
  div.col.Interact! {

    Create_Life()

    div.Options! {
      h2 "Options for Eggheads"
      Bot_Create()
    }

  }

  # //- ===========================================================
  div.col.Msgs! {
    div.Headlines!
  }

} # === main



