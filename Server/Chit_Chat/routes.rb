
# =====================================================
# Create
# =====================================================

post '/Chit_Chat' do

  begin
    Chit_Chat.create(params)
  rescue Chit_Chat::Invalid =>e
    json false, e.msg
  end

end # === post /Chit_Chat


# =====================================================
# Read
# =====================================================

post '/Chit_Chat/list' do
  msgs = user.read_chit_chat_list(params[:screen_name]).
    map(&:to_public)

  json true, "still testing", {chit_chat_list: msgs}
end # === post /Chit_Chat/list



