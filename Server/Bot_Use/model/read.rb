
class Bot_Use

  class << self

    def read_bots_for_screen_name sn
      Bot.new(Bot.
        table_for_non_owner(sn).
        where( id: TABLE.select(:bot_id).where(sn_id: sn.id, sn_type: 0)).
        all)
    end

  end # === class self ===

end # === class Bot_Use read ===





