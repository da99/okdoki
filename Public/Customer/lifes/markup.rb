

title '{{intro}} {{sn_all}}'

# applet("Create_Life")

section :js_templates do
  li.screen_name {
    a.name('', href:'{href}')
  }
end

section(:main)  {

  Nav_Bar!

  #//- ===========================================================
  div.Logo! {
    span.main "ok"
    span.sub "doki"
    span.wat_wat ": Multi-Life Chat & Publishing"
  }

  p "Your home page(s):"
  ul {
    mustache :screen_names do
    li a("{{screen_name}}", :href=>"{{href}}")
    end
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



