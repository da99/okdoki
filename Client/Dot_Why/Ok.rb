
module Ok

  def on_off val = false, show_more = false
    _class = (!val || val === 'off') ? 'off' : 'on'
    span(:class=>"on_off #{_class}") {
      a("On", :class=>'on', :href=>"#on")
      a("Off", :class=>'off', :href=>"#off")
      if (show_more)
        a("Settings", :class=>'show_more', :href=>"#more_settings")
      end
    }
  end

  def span_as
    span(:class=>'as_this_life') {
      span("as: ", :class=>'as')
      as_this_life_menu
    }
  end

  def as_this_life_menu
    select(:name=>"as_this_life") {
      customer_screen_names.each do |k, v|
        option(v, :value=>"#{v}")
      end
    }
  end

  def add_mtime src
    puts "add_mtime not done"
    return src
  end

  def script src
    super(:type=>"text/javascript", :src=>add_mtime(src))
  end

  def applet name
    blade_file = "../../applets/" + name + "/markup.blade"
    js_file    = "/applets/" + name + "/script.js"
    css_file   = "/applets/" + name + "/style.css"
    eval(File.read( blade_file ), null, blade_file, 1)
    styles  { link(css_file) }
    scripts { script js_file }
  end




end # === module
