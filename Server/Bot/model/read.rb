
class Bot
  class << self

    def read_by_screen_name sn
      new Bot::TABLE[sn_id: sn.data[:id], sn_type: Bot::SN_TYPES::SN]
    end

  end # === class self ===
end # === class Bot ===
