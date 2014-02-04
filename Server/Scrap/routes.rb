
require "./Server/Scrap/Me/index"

helpers do
  def client_data
    env['ok.client.data'] ||= {:body=>[]}
  end
end

get "/scrap/me" do
  Scrap__Me.new.run self
end
