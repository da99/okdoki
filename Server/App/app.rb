
require "sinatra"

get "/" do
  File.read("Client/App/top_slash/markup.html")
end
