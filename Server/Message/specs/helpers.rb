
require './Server/Screen_Name/specs/helpers'

module Chit_Chat_Test

  include Screen_Name_Test

  def update_last_read_at sn, days
    rows = Chit_Chat::TABLE_LAST_READ.
      returning.
      where(sn_id: sn.id).
      update(last_read_at: days_ago_in_sql(days))
    if rows.empty?
      Chit_Chat::TABLE_LAST_READ.
        returning.
        insert(sn_id: sn.id, last_read_at: days_ago_in_sql(days))
    end
  end

  def update_created_at msg, days
    Chit_Chat::TABLE.
      where(id: msg.id).
      update(created_at: days_ago_in_sql(days))
  end

  def create_chit_chat author, body, days_old = nil
    c = Chit_Chat.create author, body

    if days_old
      update_created_at c, days_old
    end

    c
  end

  def delete_all_chit_chats
    Chit_Chat::TABLE.delete
  end

  Owner_1 = Screen_Name_Test.create_screen_name
  Screen_Name_1 = Owner_1[:sn]

  Owner_2 = Screen_Name_Test.create_screen_name
  Screen_Name_2 = Owner_2[:sn]

  Owner_3 = Screen_Name_Test.create_screen_name
  Screen_Name_3 = Owner_3[:sn]

end # === module Chit_Chat_Test ===






