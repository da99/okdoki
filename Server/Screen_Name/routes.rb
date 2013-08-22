
post '/Screen_Name' do
  puts params[:screen_name]
  begin
    Screen_Name.create(params)
  rescue Ok::Invalid => e
    json false, e.msg
  end
end # === post
