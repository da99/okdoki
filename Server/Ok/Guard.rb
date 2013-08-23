
# ================ Rack Middle + DSL ===================
module Ok

  class Guard

    def initialize app, options
      @app     = app
      @options = options
      @skip    = @options[:skip] || []
      @guard   = @options[:guard] || []
    end

    def call env
      meth = env['REQUEST_METHOD']
      path = env['PATH_INFO']

      full = "#{meth}:#{path}"
      if !@guard.include?(full) && (['HEAD', 'GET'].include?(meth) || @options.include?(full))
        return @app.call env
      end

      [404, {}, ["Not Done"]]
    end

  end # === class Guard ===

end # === module Ok ===


# =====================================================
# Use it as middleware
# =====================================================
use Ok::Guard, skip: ['POST:/sign-in', 'POST:/Customer']



