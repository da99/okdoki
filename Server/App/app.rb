
require "sinatra"
require "rack/protection"

set :session_secret, "temp-spassweod-for-now-#{Time.now}"
enable :sessions
use Rack::Protection

Temp = {:home=>nil}

get "/" do
  Temp[:home] ||= File.read("Public/App/top_slash/markup.html")
end
