
require 'content-security-policy'
require 'sinatra'
require 'rack/contrib'

require './Server/Fake_Mustache/index'

ss = ENV['SESSION_SECRET']
if !ss
  raise "No session secret set."
end

# -- DB
require './Server/Ok/model'


ContentSecurityPolicy.configure do |csp|
  csp['default-src'] =  "'self'";
  csp['img-src']     =  "*"
end

# -- configure
use Rack::Session::Cookie, {
  :key          => 'session.rack.rack',
  :path         => "/",
  :expire_after => 60 * 60 * 24 * 7,  # 1 weeks
  :secret       => ss,
  :httponly     => true,
  :secure       => true
}

# -- Middleware & Helpers ----------------------------
use ContentSecurityPolicy            # 1
use Rack::Protection::RemoteReferrer # 2
use Rack::PostBodyContentTypeParser  # 3

# --- Order matters because they set up middelware ---
require './Server/Ok/Escape_All'     # 1
require './Server/Ok/CSRF'           # 2
require './Server/Ok/Guard'          # 3
require './Server/Ok/JSON_Success'   # 4
# ----------------------------------------------------

# -- Routes ------------------------------------------
get "/" do
  Fake_Mustache.new("Public/App/top_slash/markup.mustache.rb", {:YEAR=>Time.now.year}).render()
end

get "/unauthenticated" do
  "Not logged in"
end

# --------------- The Models -------------------------
models = %w{
  Customer
  Screen_Name
  Ok_Session
}.map { |w|
  require "./Server/#{w}/model"
  require "./Server/#{w}/routes"
  m = Object.const_get(w)
}









