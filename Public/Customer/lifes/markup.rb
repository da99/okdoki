

title '{{title}}'

applet("Create_Life")
applet("Bot_Create")

section :js_templates do
  li.screen_name {
    a.name('', href:'/me/{name}')
  }
end

section(:main)  {

  #//- ===========================================================
  div.Logo! {
    span.main "ok"
    span.sub "doki"
    span.wat_wat ": Multi-Life Chat & Publishing"
  }

  # //- ===========================================================
  div.col.Interact! {

    section :Create_Life

    div.Options! {
      h2 "Options for Eggheads"
      section :Bot_Create
    }

  }

  # //- ===========================================================
  div.col.Msgs! {
    div.Headlines!
  }

} # === main



