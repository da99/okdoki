
require './Server/Ok_Session/model'


post '/sign-in' do

  if (!params.screen_name || params.screen_name.strip.empty? )
    return json false, "Screen name is required."
  end

  if (!params.pass_phrase || params.pass_phrase.strip.empty? )
    return json false, "Password is required."
  end

  sign_in

  redirect target_url
end


get "/log-out" do
  logout
  session[Ok_Session::Key] = nil
  session.clear

  cookies.each { |i|
    clearCookie(i, { path: '/' });
  }

  redirect to("/"), 307
end





