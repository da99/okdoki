


require './Server/Screen_Name/model'



# =====================================================
# Create
# =====================================================


post '/me' do
  pass unless logged_in?

  begin
    sn   = Screen_Name.create(user, params)
    name = sn.data[:screen_name]
    json true, "Your new life has been created: #{name}" , {screen_name: name}
  rescue Ok::Invalid => e
    json false, e.msg
  end
end # === post

# =====================================================
# Read
# =====================================================

# ==== Redirect to canonical screen name.
before '/:type/:screen_name' do
  type = params[:type].downcase
  sn   = params[:screen_name]

  if ['me', 'bot'].include?(type)
    canon = Screen_Name.canonize(sn);

    redirect(to("/#{type}/#{canon}"), 301) unless canon == sn
  end

end # === before

get '/me/:screen_name' do
  redirect(to('/'), 302) unless logged_in?

  sn = params[:screen_name]
  begin
    life = Screen_Name.read_by_screen_name(sn)
    html 'Screen_Name/me', {
      :title       => "The bots of #{life.screen_name}",
      :screen_name => life.to_public,
      :bot         => life.bot(:to_public),
      :bot_uses    => life.bot_uses(:to_public),
      :is_owner    => logged_in? && user.is?(life)
    }
  rescue Screen_Name::Not_Found => e
    pass
  end

end


# =====================================================
# Update
# =====================================================


put '/screen_names/:name' do
  redirect(to('/'), 302) unless logged_in?

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


post '/undo/trash/:screen_name/:name' do
  n = params[:name]
  Screen_Name.undo_trash(request[:user], n)
  json true, "Screen name, #{n}, has been taken out of the trash."
end

post '/trash/:screen_name/:name' do
  name = params[:name]
  Screen_Name.trash(request[:user], n)
  json true, user.screen_name(name).trash_msg
end

