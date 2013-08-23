require 'rack/csrf'

use Rack::Csrf, :raise => true

helpers do

  def csrf_token
    Rack::Csrf.csrf_token(env)
  end

  def csrf_tag
    Rack::Csrf.csrf_tag(env)
  end

end # === module Helper ===
