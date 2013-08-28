
require './Server/Ok_Session/model'

# ================ Rack Middle + DSL ===================
module Ok

  class Session

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

    module Helpers # === Sinatra Helpers ================================

      def logged_in?
        !!user
      end

      def user
        @customer ||= begin
                        sn = session[:screen_name]
                        !!sn && Customer.find_by_screen_name(session[:screen_name])
                      rescue Customer::Not_Found => e
                        nil
                      end
      end

      def sign_in c
        log_out
        session[:screen_name] = c.screen_names.names.first
        true
      end

      def log_out
        session.keys.each { |k| session[k] = nil }
        session.clear
        cookies.keys.each { |k|
          cookies.delete k, { path: '/', domain: ".#{request.host}" }
        }
      end

    end # === module Helpers ============================================

  end # === class Guard ===

end # === module Ok ===



# =====================================================
# Use it as middleware, set-up Sinatra routes
# =====================================================
if respond_to? :helpers do

  use     Ok::Session,         skip: ['POST:/sign-in', 'POST:/user']
  helpers Ok::Session::Helpers

  get "/log-out" do
    logout
    redirect to("/"), 307 # --- temp redirect
  end

  post '/sign-in' do

    return json(false, "Screen name is required.") if (params[:screen_name] || "").strip.empty?

    return json(false, "Pass phrase is required.") if (params[:pass] || "").strip.empty?

    return begin
      sign_in Customer.find_by_screen_name_and_pass_word(params[:screen_name], params[:pass_phrase])
      json true, "You are now logged in to: #{request.host}"

    rescue Screen_Name::Not_Found => e
      json(false, e.msg)

    rescue Customer::Invalid => e
      json(false, e.msg)
    end

  end # === post



end # === Sinatra =====================================
# =====================================================




