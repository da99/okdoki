
title "Scrap Me"

[:nav_bar, :body, :footer].each do |f|
  file = File.dirname(__FILE__) + "/#{f}/markup.rb"
  eval(File.read(file), nil, file, 1)
end
