
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
        SELECT *
        FROM chit_chat INNER JOIN (
          SELECT    MAX(chit_chat_id) AS cc_id,
                    COUNT(id)         AS cc_count
          FROM      chit_chat_to
          WHERE     to_id IS NULL
                    AND from_id IN (
                            SELECT target_id
                            FROM i_know_them
                            WHERE owner_id = ? AND is_follow = true
                    )
          GROUP BY  from_id
        ) AS meta
        ON chit_chat.id = meta.cc_id
        ORDER BY chit_chat.id DESC
      ^, sn.id].limit(111).all
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





