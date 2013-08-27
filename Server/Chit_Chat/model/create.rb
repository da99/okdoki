
class Chit_Chat

  class << self

    def create_last_read u
      case u
      when Array
        return [] if u.empty?
        TABLE_LAST_READ.multi_insert(u.map { |i| {sn_id: i} }) unless u.empty?
      when Screen_Name
        TABLE_LAST_READ.
          returning.
          insert(sn_id: sn.id).
          first
      end
    end

    def create sn, opts
      if opts.is_a? String
        opts = {body: opts}
      end
      row = TABLE.
        returning.
        insert(
          type: 0,
          from_id: sn.id,
          from_type: 0,
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





