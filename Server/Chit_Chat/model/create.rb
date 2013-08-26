
class Chit_Chat

  class << self

    def create_last_read u
      case u
      when Array
        return [] if u.empty?
        TABLE_LAST_READ.multi_insert(u.map { |i| {sn_id: i} }) unless u.empty?
      when Screen_Name
        TABLE_LAST_READ.
          returning.
          insert(sn_id: sn.id).
          first
      end
    end

    def create sn, body
      row = TABLE.
        returning.
        insert(type: 0, from_id: sn.id, from_type: 0, body: body).
        first
      Chit_Chat.new row, sn
    end

  end # === class self ===

end # === class Chit_Chat create ===





