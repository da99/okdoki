
class Bot
  class Use

    TABLE = DB[:bot_use]

    def to_public
      {
        bot:         data[:bot],
        owner:       data[:owner],
        screen_name: data[:bot]
      }
    end

    def create raw
      @new_data = raw
      sn = new_data[:bot].split('@')
      clean = {
        sub_sn: sn[0],
        publisher: sn[1],
        owner_id: raw_data.aud.screen_name_id(raw_data.owner),
        TABLES: {T: "Screen_Name_Sub"}
      };

      sql = "\
        INSERT INTO @table (bot_id, owner_id)
        SELECT id, @owner_id AS owner_id
        FROM   @T
        WHERE  sub_sn = @sub_sn AND owner = @publisher
        RETURNING *
      ;"

      record = DB[sql].first

      Bot::Use.new {bot: new_data[:bot]}.merge(record)

    end # === def create

  end # === class Use ===
end # === class Bot ===






