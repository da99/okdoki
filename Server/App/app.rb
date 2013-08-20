
require "sinatra"
require "rack/protection"
require "content-security-policy"

ContentSecurityPolicy.configure do |csp|
  csp['default-src'] =  "'self'";
  csp['img-src']     =  "*"
end

set :session_secret, "temp-spassweod-for-now-#{Time.now}"
enable :sessions

use Rack::Protection
use ContentSecurityPolicy

Temp = {:home=>nil}

get "/" do
  Temp[:home] ||= File.read("Public/App/top_slash/markup.html")
end
