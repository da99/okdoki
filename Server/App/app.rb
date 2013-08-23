
require 'content-security-policy'
require 'sinatra'
require 'rack/contrib'
require 'rack/csrf'

require 'Jam_Func'
require './Server/Fake_Mustache/index'
require './Server/Ok/Escape_All'
require './Server/Ok/Guard'
require './Server/Ok/JSON_Success'

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
rack_key = 'session.rack.rack'
use Rack::Session::Cookie, {
  :key          => 'session.rack.rack',
  :path         => "/",
  :expire_after => 60 * 60 * 24 * 7,  # 1 weeks
  :secret       => ss,
  :httponly     => true,
  :secure       => true
}

# -- Middleware
use ContentSecurityPolicy            # 1
use Rack::Protection::RemoteReferrer # 2
use Rack::Csrf, :raise => true       # 3

use Rack::PostBodyContentTypeParser

use Ok::Guard
extend Ok::Guard::DSL

# -- Helpers
helpers Ok::Escape_All::Helper
helpers Ok::JSON_Success::Helper

helpers do
  def csrf_token
    Rack::Csrf.csrf_token(env)
  end

  def csrf_tag
    Rack::Csrf.csrf_tag(env)
  end
end

# -- Routes
get "/" do
  Fake_Mustache.new("Public/App/top_slash/markup.mustache.rb", {:YEAR=>Time.now.year}).render()
end

get "/unauthenticated" do
  "Not logged in"
end

# ---------------------------- The Models --------------------------
models = %w{
  Customer
  Screen_Name
  Ok_Session
}.map { |w|
  require "./Server/#{w}/model"
  require "./Server/#{w}/routes"
  m = Object.const_get(w)
}

Jam = Jam_Func.new() # (*(models.map { |m| m::Jam }))











