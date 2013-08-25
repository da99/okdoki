
class Bot
  class Code

    TABLE = DB[:bot_code]

    TYPES = %w{
      settings
      all
      multi_life
      life
    }

    code = clean_code new_data[:code]
  end # === class Code ===
end # === class Bot ===









