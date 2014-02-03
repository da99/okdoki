
require "./Server/Scrap/Me/index"

helpers do
  def ok_data
    env['ok.data'] ||= {:body=>[]}
  end
end

get "/scrap/me" do
  Scrap__Me.new.run self
end
