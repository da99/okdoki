
class Screen_Name_Code_Consume
  class List
    include Okdoki::Model::List

    attr_reader :screen_name

    def initialize sn
      @screen_name = sn
    end

    def list
      @list ||= begin
                  Bot.
                    table_for_non_owners(screen_name).
                    where(id: Screen_Name_Code_Consume.table_for_owners(screen_name).select(:bot_id)).
                    all
                end
    end

  end # === class List ===
end # === class Screen_Name_Code_Consume ===
