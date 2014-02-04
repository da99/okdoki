
require 'content-security-policy'
require 'sinatra'
require 'rack/contrib'

ContentSecurityPolicy.configure do |csp|
  csp['default-src'] =  "'self' *.okdoki.com localhost";
  csp['img-src']     =  "*"
end

# -- Middleware --------------------------------------
use Rack::Protection::SessionHijacking # 0
use ContentSecurityPolicy              # 1
use Rack::Protection::RemoteReferrer   # 2
use Rack::PostBodyContentTypeParser    # 3
use Rack::Protection::EscapedParams    # 4
use Rack::Protection::RemoteReferrer   # 5

# --- Order matters because they set up middelware ---
require './Server/Ok/Session'        # 0
require './Server/Ok/Deserialize_User' # 0.1
require './Server/Ok/As_This_Life'   # 0.2
require './Server/Ok/Escape_All'     # 1
require './Server/Ok/CSRF'           # 2
require './Server/Ok/JSON_Success'   # 3
require './Server/Ok/HTML_Render'    # 4
require './Server/Ok/Bool_Params'    # 5
require './Server/Ok/No_Cache'       # 6
# ----------------------------------------------------

# --- Siantra Helpers --------------------------------
require './Server/Ok/logic_for'
# ----------------------------------------------------

# --- Init the DB Connection -------------------------
require './Server/Ok/model'

# --- The Models -------------------------------------
%w{ Customer Screen_Name }.each { |m|
  require "./Server/#{m}/model"
}

# --- The Routes -------------------------------------
require "./Server/App/routes"
require "./Server/Customer/routes"
require "./Server/Screen_Name/routes"

if ENV['IS_DEV']
  require "./Server/Scrap/routes"
end


# --- Error Handling ---------------------------------
NOT_FOUND = File.read("./Public/errors/404.html")
ERROR_50x = File.read("./Public/errors/50x.html")

not_found do
  NOT_FOUND.sub('{{path}}', request.path_info)
end

error do
  ERROR_50x.sub('{{path}}', request.path_info) # env['sinatra.error'].name
end
# ----------------------------------------------------






