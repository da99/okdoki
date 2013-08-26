
class Bot
  class List

    def initialize owner, type
      @owner = owner
      @type = type
    end

    def list
      @list ||= begin
                  case @owner
                  when Customer
                    Bot.read_by_owner_customer(@owner)
                  else
                    raise "Unknown type: #{type}"
                  end
                end
    end

  end # === class List ===
end # === class Bot ===
