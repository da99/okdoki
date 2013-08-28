
require 'content-security-policy'
require 'sinatra'
require 'rack/contrib'

ContentSecurityPolicy.configure do |csp|
  csp['default-src'] =  "'self'";
  csp['img-src']     =  "*"
end

# -- Middleware & Helpers ----------------------------
use Rack::Protection::SessionHijacking # 0
use ContentSecurityPolicy              # 1
use Rack::Protection::RemoteReferrer   # 2
use Rack::PostBodyContentTypeParser    # 3
use Rack::Protection::EscapedParams    # 4
use Rack::Protection::RemoteReferrer   # 5

# --- Order matters because they set up middelware ---
require './Server/Ok/Session'        # 0
require './Server/Ok/Escape_All'     # 1
require './Server/Ok/CSRF'           # 2
require './Server/Ok/JSON_Success'   # 3
require './Server/Ok/HTML_Render'    # 4
# ----------------------------------------------------

# -- DB
require './Server/Ok/model'

# --- Routes -----------------------------------------
%w{
  App
  Customer
  Screen_Name
}.map { |w|
  require "./Server/#{w}/routes"
}









