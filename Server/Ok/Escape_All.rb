
require "escape_utils"


module Ok

  module Escape_All

    module Helper
      def params
        @clean_params ||= begin
                            dirty = super
                            return dirty if dirty.empty?

                            o = {}
                            super.keys.each do |k|
                              o[Escape_All.escape(k.to_s).to_sym] = Escape_All.escape(dirty[k])
                            end

                            o
                          end
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

    end # === class self ===

  end # === mod Escape_All ===

end # === module Ok ===

