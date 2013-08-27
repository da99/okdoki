
require "escape_utils"

if respond_to? :helpers
  helpers do

    def params
      @clean_params ||= begin
                          dirty = super
                          return dirty if dirty.empty?

                          o = {}
                          super.keys.each do |k|
                            o[Ok::Escape_All.escape(k.to_s).to_sym] = Ok::Escape_All.escape(dirty[k])
                          end

                          o
                        end
    end

  end # === end helpers
end


module Ok
  module Escape_All
    class << self

      def e o
        EscapeUtils.escape_html(EscapeUtils.unescape_html(o.to_s.force_encoding 'utf-8'))
      end

      def escape o
        if o.kind_of? Array
          return o.map do |v|
            Escape_All.escape(v)
          end
        end

        if o.kind_of? Hash
          new_o = {}

          o.each do |k, v|
            new_o[k] = Escape_All.escape(v)
          end

          return new_o
        end

        Escape_All.e(o)

      end # === def

    end # === class self ===
  end # === mod Escape_All ===
end # === module Ok ===



