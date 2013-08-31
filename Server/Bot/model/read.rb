
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
    @codes ||= []

    if args.first == :read
      if @codes.empty?
        @codes = Bot_Code.new(
          DB[%^
          SELECT *
          FROM bot_code
          WHERE bot_id = :id
            ^, :id=>id].all
        )
      end

      return @codes
    end

    if args.size == 1 && args.first.is_a?(Array)
      @codes.concat args
    end

    if args.first == :to_public
      return @codes.map(&:to_public)
    end

    @codes
  end

  "id bot_id".split.each { |k|
    eval %^
      def #{k}
        data[:#{k}]
      end
    ^
  }


  def screen_name
    data[:screen_name] || @screen_name.screen_name
  end

  def href
    "/me/#{screen_name}"
  end

  def to_public
    {
       codes: codes(:to_public),
       screen_name: data[:screen_name],
       is_on: data[:is_one],
       href:  href
    }
  end

end # === class Bot ===
