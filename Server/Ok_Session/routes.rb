
require './Server/Ok_Session/model'

get "/log-out" do
  session[Ok_Session::Key] = nil
  session.clear
  redirect to("/"), 307
end
