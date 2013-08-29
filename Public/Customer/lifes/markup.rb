

title '{{title}}'

applet("Create_Life")

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
      div.box {
        div.content {
          p %^None yet.^
        }
      }
    }

  }

  # //- ===========================================================
  div.col.Msgs! {
    div.Headlines!
  }

} # === main



