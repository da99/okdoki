
module Ok
  class Deserialize_User

    def initialize app, options = nil
      @app = app
    end

    def call env
      env['ok.user'] = nil
      s = env['rack.session']
      sn = s && s['screen_name']
      if sn
        begin
          env['ok.user'] = Customer.read_by_serialized(sn)
        rescue Customer::Not_Found => e
        end
      end

      @app.call env
    end

  end # === class Deserialize_User ===
end # === module Ok ===

if respond_to?(:use, true)
  use Ok::Deserialize_User
end



