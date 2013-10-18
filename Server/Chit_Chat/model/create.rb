
class Chit_Chat

  class << self

    def create sn, opts
      if opts.is_a? String
        opts = {body: opts}
      end

      temp = new({})
      temp.new_data.merge! :body=>opts[:body]

      if !opts[:body]
        raise self::Invalid.new(temp, "Message body is required.")
      end

      if opts[:body].size > 1000
        raise self::Invalid.new(temp, "Too many characters: #{opts[:body].size - 1000} over the limit.")
      end

      count = DB["
        SELECT count(id) AS c
        FROM   #{Table_Name}
        WHERE  pub_id = :sn_id
      ", :sn_id => sn.id].first[:c]

      row = TABLE.
        returning.
        insert(
          pub_id: sn.id,
          author_id: sn.id,
          body: opts[:body]
        ).first

      if count >= Create_Limit


        chit_chat_id = Chit_Chat::TABLE.
        where(:pub_id=>sn.id).
        order_by(:created_at).
        limit(1).
        first[:id]

        DB["

          -- Delete chit chat:
          DELETE FROM #{Table_Name}
          WHERE id = :chit_chat_id;

          -- Delete chit chat comments:
          DELETE FROM #{Comment::Table_Name}
          WHERE pub_type_id = :p_type AND
                pub_id      = :chit_chat_id;

        ", :chit_chat_id=>chit_chat_id, :p_type=>Comment.to_pub_type_id(Chit_Chat.new({}))]
        .all

        row[:oldest_deleted] = true
      end

      Chit_Chat.new row, sn
    end

  end # === class self ===

end # === class Chit_Chat create ===





