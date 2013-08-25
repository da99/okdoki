
class Customer

  class << self

    def read_by_id id
      new TABLE.limit(1)[id: id]
    end # === def

    def read_by_screen_name name
      sn = Screen_Name.read_by_screen_name(name)
      Customer.read_by_id(sn.data[:owner_id])
    end # === def


    def read_by_screen_name_and_pass_word screen_name, pass_word
      c = read_by_screen_name(screen_name)

      last_row = TABLE.
        returning.
        where("log_in_at != ? AND id = ?", Ok::Model::PG::UTC_NOW_DATE, c.data[:id]).
        update(log_in_at: Ok::Model::PG::UTC_NOW_DATE, bad_log_in_count: 0).
        first

      if !last_row  # === User has logged-in previously today.
        if c.data[:bad_log_in_count] > 3
          raise Too_Many_Bad_Logins.new(c, 'Too many bad log-ins for today. Try again tomorrow.')
        end
      end

      bad_login = TABLE.
        returning.
        where(" id = ? AND pswd_hash != ? ", c.data[:id], c.decode_pass_word(pass_word)).
        update(" bad_log_in_count = (bad_log_in_count + 1) ").
        first

      if bad_login
        puts bad_login
        raise Wrong_Pass_Word.new(c, 'Pass phrase is incorrect. Check your CAPS LOCK key.')
      end

      c
    end # === def login

  end # === class self ===

end # === class Customer read ===





