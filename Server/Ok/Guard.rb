
# ================ Rack Middle + DSL ===================

def unguard
  return meth, path
  Ok::Guard::UNGUARDED.push [meth, path]
end # === def unguard

module Ok

  class Guard

    UNGUARDED = []

    def initialize app
      @app = app
    end

    def call env
      puts env
      @app.call env
    end

  end # === class Guard ===

  class DSL

    [:get, :post, :put, :delete].each { |meth|
      instance_eval %!
        def #{meth} *args, &blok
          Ok::Guard:UNGUARDED.push [#{meth.to_s.upcase}, args.first]
          super
        end
      !
    }

  end # === class DSL ===

end # === module Ok ===
