


get '/test' do
  o = {}
  Jam.run('test', o)
  o.map { |k, v|
    k.to_s
  }.join(" ")
end # === /test
