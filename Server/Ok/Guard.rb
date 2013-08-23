
# ================ Rack Middle + DSL ===================
module Ok

  class Guard

    UNGUARDED = []

    def initialize app
      @app = app
    end

    def call env
      meth = env['REQUEST_METHOD']
      path = env['PATH_INFO']

      if ['HEAD', 'GET'].include?(meth) || Ok::Guard::UNGUARDED.include?([meth, path])
        return @app.call env
      end

      [404, {}, ["Not Done"]]
    end

    module DSL

      def unguard *args, &blok
        Ok::Guard::UNGUARDED.push [args.first, args[1]]
        send *args, &blok
      end # === def unguard

    end # === module DSL ===

  end # === class Guard ===

end # === module Ok ===
