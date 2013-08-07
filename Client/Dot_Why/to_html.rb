
require 'erector'

module Diet_Dot

  def dot_i str = "i", v = nil
    rawdot str, v
  end

  def dot_v str = "v", v = nil
    rawdot str, v
  end

  def inline_rawdot str
    rawtext(rawdot(str, :inline))
  end

  def rawdot val, v = nil
    str = "[[=#{val}]]"
    if v === :inline
      return str
    end
    text  str + (v || "")
  end

  def dot name, v = ""
    text "[[=data.#{name}]]#{v || ""}"
  end

  def dot_array name
    text "[[~data." + name + " :v:i]]"
    yield
    text "[[~]]"
  end

  def dot_tertiary a, b, c
    rawtext "[[? #{a} ]]"
    rawdot b
    rawtext "[[??]]"
    rawdot c
    rawtext "[[?]]"
  end

end # === module



class Layout < Erector::Widget

  include Diet_Dot

  def initialize *args
    super
    @_blocks = {}
  end

  class << self
    def blocks *args
      args.each do |word|
        define_method(word.to_sym) do |pos = :bottom, &b|
          block word, pos, &b
        end
      end
    end
  end

  blocks :main

  def block raw_name, pos = :bottom, *args, &b
    name = raw_name.to_sym
    if (b)
      @_blocks[name] ||= []
      if (pos == :top)
        @_blocks[name].unshift(b)
      elsif (pos == :replace)
        @_blocks[name] = [b]
      else
        @_blocks[name].push(b)
      end
    else
      (@_blocks[name] || []).each  do |bl|
        bl.call
      end
    end
  end

  def styles *args, &b
    @_link_type = :css
    block :styles, *args, &b
    @_link_type = nil
  end

  def link *args
    if (@_link_type == :css && args.length == 1 && args[0].instance_of?(String))
      super(:rel=>"stylesheet", :type=>"text/css", :href=>args[0])
    else
      super
    end
  end

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



  def content
    rawtext "<!DOCTYPE html>"
    html(:lang=>'en') do
      head do
        title { dot "title" }
        meta(:"http-equiv"=>"Content-Type",  :content=>"text/html charet=UTF-8" )
        meta(:"http-equiv"=>"Cache-Control", :content=>"no-cache, max-age=0, must-revalidate, no-store, max-stale=0, post-check=0, pre-check=0" )

        link(:rel=>'shortcut icon', :href=>'/favicon.ico')

        styles {
          link("/css/lenka-stabilo.css")
          link("/css/circus.css")

          link('/css/vanilla.reset.css')
          link("/css/okdoki.css")
          link("/css/forms.css")
        }

        styles
      end
      body(:class=>inline_rawdot("(is_customer) ? \"is_customer\" : \"is_stranger\"")) do
        main
      end
    end
  end

end

class The_Partial < Layout

  def initialize *args
    super
    eval(File.read("#{ARGV[0]}"), nil, "t.rb", 1)
  end

end

page = The_Partial.new
puts page.to_html(:prettyprint=>true)

# puts( FAQ.new.to_html(:prettyprint => true ) )







