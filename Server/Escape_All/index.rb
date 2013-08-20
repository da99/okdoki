
require "escape_utils"


module Escape_All

  module Sinatra
    def params
      if !@clean_params
        dirty = super
        if dirty.empty?
          return dirty
        end
      end

      o = {}
      dirty = super
      super.keys.each do |k|
        o[Escape_All.escape(k.to_s).to_sym] = Escape_All.escape(dirty[k])
      end
      o
    end
  end # === module

  class << self

    def e o
      EscapeUtils.escape_html(EscapeUtils.unescape_html(o))
    end

    def escape o
      if o.kind_of? Array

        return o.map do |v|
          Escape_All.e(v)
        end

      end

      if o.kind_of? Hash

        new_o = {}

        o.each do |k, v|
          new_o[k] = Escape_All.e(v)
        end

        return new_o

      end

      Escape_All.e(o)

    end # === def

  end # === class self

end # === mod

