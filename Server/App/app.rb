
require "sinatra"
Temp = {:home=>nil}

get "/" do
  Temp[:home] ||= File.read("Client/App/top_slash/markup.html")
end
