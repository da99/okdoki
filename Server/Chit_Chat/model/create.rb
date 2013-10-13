
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
          from_id: sn.id,
          body: opts[:body]
        ).first

      Chit_Chat.new row, sn
    end

  end # === class self ===

end # === class Chit_Chat create ===





