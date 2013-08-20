
require "sinatra"
Temp = {:home=>nil}

get "/" do
  Temp[:home] ||= File.read("Public/App/top_slash/markup.html")
end
