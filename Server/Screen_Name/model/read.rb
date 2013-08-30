require "./Server/Bot_Code/model"

class Screen_Name

  class << self

    def read_by_id id
      Screen_Name.new TABLE.limit(1)[:id=>id], "Screen name not found."
    end

    def read_by_screen_names arr
      new TABLE.where(screen_name: Screen_Name.canonize(arr)).all
    end

    def read_by_screen_name raw_sn
      new TABLE[:screen_name=>Screen_Name.canonize(raw_sn)], "Screen name not found: #{raw_sn}"
    end

    def read_by_customer c
      new TABLE.where(owner_id: c.data[:id]).all
    end

  end # === class self ===

  def owner
    @owner ||= Customer.read_by_id(data[:owner_id])
  end

  def bot cmd = nil
    if !@bot_read
      @bot_read = true
      @bot = Bot.read_by_screen_name(self) rescue nil
    end

    return @bot.send(cmd) if cmd && @bot
    @bot
  end

  def bot_uses cmd = nil
    @bot_uses ||= begin
                    bots = Hash[ Bot.new(
                      DB[%^
                        SELECT bot.*, screen_name.screen_name as screen_name
                        FROM bot inner join screen_name
                          ON bot.sn_id = screen_name.id
                        WHERE bot.id IN (
                          SELECT bot_id
                          FROM bot_use
                          WHERE sn_id = :sn_id AND is_on IS TRUE
                        )
                      ^, :sn_id=>id].all
                    ).map { |b| [b.id, b] } ]

                    codes = Bot_Code.new(DB[%^
                      SELECT *
                      FROM bot_code
                      WHERE bot_id IN ( :ids )
                    ^, :ids=>bots.keys].all)

                    codes.each { |c|
                      bots[c.bot_id].codes c
                    }

                    bots.values
                  end

    return @bot_uses unless cmd

    @bot_uses.map(&cmd)
  end # === def bot_uses

  def read type, *args
    case type
    when :chit_chat_inbox
      Chit_Chat.read_inbox self
    else
      raise "Unknown action: #{type}"
    end
  end

  def href
    "/me/#{screen_name}"
  end

  def to_public
    {
      :screen_name => screen_name,
      :href => href
    }
  end

  def screen_name
    data[:screen_name]
  end

  def find_screen_name_keys arr
    rec     = arr[0] || {:screen_name_id=>nil}
    key     = SCREEN_NAME_KEYS.detect { |k| rec.has_key? k }
    key     = key || :screen_name_id
    new_key = key.to_s.sub('_id', '_screen_name').to_sym
    [key, new_key]
  end

  def is? raw_str
    data[:screen_name] == Screen_Name.canonize(raw_str)
  end

end # === class Screen_Name read ===





