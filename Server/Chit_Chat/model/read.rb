
class Chit_Chat

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
  end # === class self ===

end # === class Chit_Chat read ===





