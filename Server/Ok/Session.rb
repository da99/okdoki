
require 'sinatra/cookies'

# ================ Rack Middle + DSL ===================
module Ok

  class Session

    def initialize app, options
      @app     = app
      @options = {:session_key => 'rack.session'}.merge(options)
      @skip    = @options[:skip] || []
      @guard   = @options[:guard] || []
    end

    def call env
      meth    = env['REQUEST_METHOD']
      path    = env['PATH_INFO']
      session = env[@options[:session_key]]

      full = "#{meth}:#{path}"
      if session['screen_name'] || !@guard.include?(full) && (['HEAD', 'GET'].include?(meth) || @skip.include?(full))
        return @app.call env
      end

      [401, {'Content-Type': 'application/json'}, MultiJson.dump({:success=>false, :msg=>"You have to re-login."})]
    end

    module Helpers # === Sinatra Helpers ================================

      def logged_in?
        !!user
      end

      def user
        @screen_name ||= begin
                           sn = session['screen_name']
                           !!sn && Screen_Name.read_by_screen_name(sn)
                         rescue Screen_Name::Not_Found => e
                           nil
                         end
      end

      def sign_in c
        log_out
        session[:screen_name] = c.screen_names.screen_names.first
        true
      end

      def log_out
        session.keys.each { |k| session[k] = nil }
        session.clear
        cookies.keep_if { |k,v| false }
      end

    end # === module Helpers ============================================

  end # === class Session ===

end # === module Ok ===


# =====================================================
# Use it as middleware, set-up Sinatra routes
# =====================================================
if respond_to? :helpers, true

  use     Ok::Session,         skip: ['POST:/sign-in', 'POST:/user']
  helpers Ok::Session::Helpers

  get "/log-out" do
    logout
    redirect to("/"), 307 # --- temp redirect
  end

  post '/sign-in' do

    return json(false, "Screen name is required.") if (params[:screen_name] || "").strip.empty?

    return json(false, "Pass phrase is required.") if (params[:pass] || "").strip.empty?

    begin
      sign_in Customer.find_by_screen_name_and_pass_word(params[:screen_name], params[:pass_phrase])
      json true, "You are now logged in to: #{request.host}"

    rescue Screen_Name::Not_Found => e
      json(false, e.msg)

    rescue Customer::Invalid => e
      json(false, e.msg)
    end

    return

  end # === post


  if ENV['IS_DEV']
    def add_padding k
      padding = 30
      size = (padding - k.to_s.size)
      size = 1 if size < 1
      " " * size
    end

    def inspect_line k, v
      "#{k.inspect}:#{add_padding k}#{v.inspect}\n"
    end

    get "/test/session" do
      pass if env['HTTP_X_REAL_IP'] != '127.0.0.1'

      a = "Session: \n"
      session.each { |k, v| a  << inspect_line(k, v) }

      a << "\n\nHeaders:\n"
      env.each { |k, v| a  << inspect_line(k, v) }

      content_type :text
      a
    end
  end

end # === Sinatra =====================================
# =====================================================



