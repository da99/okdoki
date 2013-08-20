
require "sinatra"
require "rack/protection"
require "content-security-policy"
require "./Server/Fake_Mustache/index"
require "./Server/Escape_All/index"

ContentSecurityPolicy.configure do |csp|
  csp['default-src'] =  "'self'";
  csp['img-src']     =  "*"
end

set :session_secret, "temp-secret-for-dev-#{Time.now}"
enable :sessions

use Rack::Protection
use ContentSecurityPolicy
helpers Escape_All::Sinatra

get "/" do
  Fake_Mustache.new("Public/App/top_slash/markup.mustache.html", {:YEAR=>Time.now.year}).render()
end

