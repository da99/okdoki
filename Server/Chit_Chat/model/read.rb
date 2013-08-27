
class Chit_Chat

  attr_reader :from

  class << self

    def last_read_for u
      case
      when Customer
        TABLE_LAST_READ.where(sn_id: u.screen_names.ids).all
      when Screen_Name
        TABLE_LAST_READ.where(sn_id: u.id).first
      else
        raise "Unknown type: #{u.class}"
      end
    end

    def read_inbox sn
      new DB[%^
        SELECT chit_chat.*
        FROM chit_chat INNER JOIN chit_chat_to
          ON chit_chat.id = chit_chat_to.chit_chat_id
        WHERE chit_chat_to.from_id != ? AND
              chit_chat_to.from_id IN (
                SELECT target_id
                FROM i_know_them
                WHERE owner_id = ? AND is_follow = true
              )
      ^, sn.id, sn.id].limit(111).all
    end

  end # === class self ===

  %w{ id from_id from_type body }.each { |n|
    eval %^
      def #{n}
        data[:#{n}]
      end
    ^
  }

end # === class Chit_Chat read ===





