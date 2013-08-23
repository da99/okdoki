
require 'multi_json'

# === Sinatra Helper
#
#
module Ok

  module JSON_Success

    module Helper

      def json *args
        o = {:success => true, :msg=>"Done."}
        args.each { |v|
          if !!v == v
            o[:success] = v
          elsif v.kind_of? String
            o[:msg] = v
          else
            o.merge! v
          end
        }
        content_type :json
        MultiJson.dump o
      end

    end # === module Helper ===

  end # === module JSON_Success ===

end # === module Ok ===

