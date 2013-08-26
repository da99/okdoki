
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
  end # === class self ===

  %w{ from_id from_type body }.each { |n|
    eval %^
      def #{n}
        data[:#{n}]
      end
    ^
  }

end # === class Chit_Chat read ===





