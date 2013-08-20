
require "sinatra"
require "rack/protection"
require "content-security-policy"
require "./Server/Fake_Mustache/index"
require "./Server/Escape_All/index"

ContentSecurityPolicy.configure do |csp|
  csp['default-src'] =  "'self'";
  csp['img-src']     =  "*"
end

# -- configure
set :session_secret, "temp-secret-for-dev-#{Time.now}"
enable :sessions

# -- Middleware
use Rack::Protection
use ContentSecurityPolicy

# -- Helpers
helpers Escape_All::Sinatra

# -- Routes
get "/" do
  Fake_Mustache.new("Public/App/top_slash/markup.mustache.html", {:YEAR=>Time.now.year}).render()
end

get "/:hello" do
  params[:hello]
end
