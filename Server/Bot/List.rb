
class Bot
  class List

    def initialize owner, type
      case type
      when :owner
        @list = Bot::TABLE.
          where(owner_id: owner.data[:id], owner_type: Bot::CUSTOMER_OWNER).
          all
      else
        raise "Unknown type: #{type}"
      end
    end

  end # === class List ===
end # === class Bot ===
