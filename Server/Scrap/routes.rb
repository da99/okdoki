

helpers do
  def client_data
    env['ok.client.data'] ||= {:body=>[]}
  end
end

get "/scrap/me" do
  logic_for "Scrap/Me"
  client_data[:body].join("<br />\n")
end
