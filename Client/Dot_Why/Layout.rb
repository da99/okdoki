
require 'erector'

class Layout < Erector::Widget

  def initialize *args
    super
    @_blocks = {}
  end

  class << self
    def blocks *args
      args.each do |word|
        define_method(word.to_sym) do |pos = :bottom, &b|
          if (b)
            @_blocks[word.to_sym] ||= []
            if (pos == :top)
              @_blocks[word.to_sym].unshift(b)
            else if (pos == :replace)
              @_blocks[word.to_sym] = [b]
            else
              @_blocks[word.to_sym].push(b)
            end
          else
            (@_blocks[word.to_sym] || []).each  do |bl|
              bl.call
            end
          end
        end
      end
    end
  end

  blocks :main

  def styles
    @_link_type = :css
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
    html do
      head do
        title "Hello"
        styles
      end
      body do
        main
      end
    end
  end
end

class FAQ < Layout

  def initialize *args
    super
    eval(File.read("t.rb"), nil, "t.rb", 1)
  end


  def dot name, v = ""
    text "[[=" + name + "]]" + v
  end

  def dot_array name
    text "[[~data." + name + " :v:i]]"
    yield
    text "[[~]]"
  end

end

page = FAQ.new
puts page.to_html(:prettyprint=>true)

# puts( FAQ.new.to_html(:prettyprint => true ) )







