
require './tests/helpers/Screen_Name'

module Chit_Chat_Test

  include Screen_Name_Test

  def days_ago days
    Sequel.lit(Ok::Model::PG::UTC_NOW_RAW + " - interval '#{days * 24} hours'")
  end

  def update_last_read_at sn, days
    rows = Chit_Chat::TABLE_LAST_READ.
      returning.
      where(sn_id: sn.id).
      update(last_read_at: days_ago(days))
    if rows.empty?
      Chit_Chat::TABLE_LAST_READ.
        returning.
        insert(sn_id: sn.id, last_read_at: days_ago(days))
    end
  end

  def update_created_at msg, days
    Chit_Chat::TABLE.
      where(id: msg.id).
      update(created_at: days_ago(days))
    Chit_Chat::TABLE_TO.
      where(chit_chat_id: msg.id).
      update(created_at: days_ago(days))
  end

  Owner_1 = Screen_Name_Test.create_screen_name
  Screen_Name_1 = Owner_1[:sn]

  Owner_2 = Screen_Name_Test.create_screen_name
  Screen_Name_2 = Owner_2[:sn]

  Owner_3 = Screen_Name_Test.create_screen_name
  Screen_Name_3 = Owner_3[:sn]

end # === module Chit_Chat_Test ===






