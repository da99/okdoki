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
      r = TABLE.limit(1)[:screen_name=>Screen_Name.canonize(raw_sn)]
      new r, "Screen name not found: #{raw_sn}"
    end

    def read_by_customer c
      new TABLE.where(owner_id: c.data[:id]).all
    end

  end # === class self ===

  def owner
    @owner ||= Customer.read_by_id(data[:owner_id])
  end

  def bot
    @bot ||= begin
               Bot.read_by_screen_name self
             end
  end

  def bot_uses
    @bot_uses ||= begin
                    bots = Hash[ Bot.new(
                      DB[%^
                        SELECT *
                        FROM bot
                        WHERE id IN (
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
  end

  def read type, *args
    case type
    when :chit_chat_inbox
      Chit_Chat.read_inbox self
    else
      raise "Unknown action: #{type}"
    end
  end

  def href
    "/me/#{name}"
  end

  def to_public
    {
      :name => name,
      :href => href
    }
  end

end # === class Screen_Name read ===





