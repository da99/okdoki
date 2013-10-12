
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

      row = TABLE.
        returning.
        insert(
          type: 0,
          from_id: sn.id,
          body: opts[:body]
        ).first

      if opts[:to] && !opts[:to].empty?
        ids = Screen_Name.read_by_screen_names(opts[:to]).map(&:id)
        TABLE_TO.multi_insert(ids.map { |i| {chit_chat_id: row[:id], from_id: sn.id, to_id: i, to_type: 0} })
      else
        TABLE_TO.insert(chit_chat_id: row[:id], from_id: sn.id)
      end

      Chit_Chat.new row, sn
    end

  end # === class self ===

end # === class Chit_Chat create ===





