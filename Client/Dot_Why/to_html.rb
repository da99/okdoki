
require 'erector'


require_relative "./Diet_Dot"
require_relative "./Ok"

class Layout < Erector::Widget

  include Diet_Dot
  include Ok

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
      body(:class=>inline_rawdot("(data.is_customer) ? \"is_customer\" : \"is_stranger\"")) do
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







