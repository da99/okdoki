
class Chit_Chat

  class << self

    def create_last_read u
      case u
      when Array
        return [] if u.empty?
        TABLE_LAST_READ.multi_insert(u.map { |i| {sn_id: i} }) unless new_rows.empty?
      when Screen_Name
        TABLE_LAST_READ.
          returning.
          insert(sn_id: sn.id).
          first
      end
    end

  end # === class self ===

end # === class Chit_Chat create ===





