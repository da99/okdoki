
class Bot
  class << self

    def read_by_screen_name sn
      row = Bot::TABLE[sn_id: sn.data[:id]]
      if row
        Bot.new(row, sn)
      else
        raise self::Not_Found.new("Bot not found for: #{sn.screen_name}")
      end
    end

  end # === class self ===

  def codes *args
    if args.empty?
      @codes ||= Bot_Code.new(
        DB[%^
          SELECT *
          FROM bot_code
          WHERE bot_id = :id
        ^, :id=>id].all
      )
    else
      @codes.concat args
    end
  end

  "id bot_id".split.each { |k|
    eval %^
      def #{k}
        data[:#{k}]
      end
    ^
  }


  def screen_name
    puts data.inspect
    data[:screen_name] || @screen_name.screen_name
  end

  def href
    "/me/#{screen_name}"
  end

  def to_public
    { codes: codes.to_public, screen_name: data[:screen_name] }
  end

end # === class Bot ===
