
class Chit_Chat

  class << self

    def update_last_read u
      case u
      when Customer
        updated = TABLE_LAST_READ.
          returning.
          where(sn_id: u.screen_names.ids).
          update(last_read_at: Ok::Model::PG::UTC_NOW).
          map { |r| r[:sn_id] }

        Chit_Chat.create_last_read(u.screen_names.ids.select { |i|
          !updated.include?(i)
        })

      when Screen_Name
        row = TABLE_LAST_READ.
          returning.
          where(sn_id: u.id).
          update(last_read_at: Ok::Model::PG::UTC_NOW).
          first
        if !row
          Chit_Chat.create_last_read u
        end
      else
        raise "Unknown type: #{u}"
      end

      return u
    end
  end # === class self ===

end # === class Chit_Chat update ===





