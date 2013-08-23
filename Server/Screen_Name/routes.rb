
require './Server/Screen_Name/model'

# =====================================================
# Create
# =====================================================


post '/Screen_Name' do
  puts params[:screen_name]
  begin
    Screen_Name.create(params)
  rescue Ok::Invalid => e
    json false, e.msg
  end
end # === post

post('/me' do
  params[:user] = request[:user]
  sn = Screen_Name.create(c);
  name = sn.data[:screen_name]

  json true, "Your new life has been created: #{name}" , {screen_name: name}
end


# =====================================================
# Read
# =====================================================


# ==== Redirect to canonical screen name.
get '/:type/:screen_name' do
  type = params[:type]
  sn   = params[:screen_name]
  pass if ['me', 'bot'].include?(type)

  canon = Screen_Name.to_canon(sn);

  if canon == sn
    pass
  else
    redirect 301, "/#{type}/#{canon}"
  end
end

get '/me/:screen_name' do

  begin
    life = Screen_Name.read_by_screen_name params.screen_name
    html 'Screen_Name/me', title: "The life of #{life.data[:screen_name]}"
  rescue Screen_Name::Not_Found => e
    pass
  end

end



# =====================================================
# Update
# =====================================================


put '/screen_names/:name' do
  n = params[:name]
  begin
    sn = Screen_Name.update params, request[:user]
    c   = request[:user]
    msg = case sn.data[:read_able]
          when 'W'
            "Updated settings: Anyone online may see this homepage."
          when 'N'
            "Updated settings: no one but you can see this homepage."
          when 'S'
            "Updated settings: The following may see your homepage: " + c.sanitized_data.read_able_list.join(', ')
          else
            if c.sanitized_data.about
              'Your "About Me" section has been updated.'
            elsif (c.sanitized_data.new_screen_name)
              'Your screen name has been updated.'
            else
              'Your web app info has been updated.'
            end
          end # === case

    json true,  msg, updated: sn.to_public

  rescue Screen_Name::Invalid => e

    json false, e.msg

  end # === begin

end # === post /screen_name/:name


# =====================================================
# Trash/Delete
# =====================================================


  OK.post('/undo/trash/:screen_name/:name', function (req, resp, next) {
    var n = req.params.name;
    var r = New_River(next);
    r
    .job('undo trash screen name', n, [Screen_Name, 'undo_trash', req.user, n])
    .run(function () {
      write.json_success(resp, "Screen name, " + n + ", has been taken out of the trash.");
    });
  });

  OK.post('/trash/:screen_name/:name', function (req, resp, next) {
    var name = req.params.name;
    var r = New_River(next);
    r
    .job('trash screen name', n, [Screen_Name, 'trash', req.user, n])
    .run(function () {
      write.json_success(resp, c.screen_name_row(name).trash_msg);
    });
  });






















