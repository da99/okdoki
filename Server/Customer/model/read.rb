
class Customer

  class << self

    def read_by_id id
      new TABLE.limit(1)[id: id]
    end # === def

    def read_by_screen_name name
      sn = Screen_Name.read_by_screen_name(name)
      Customer.read_by_id(sn.data[:owner_id])
    end # === def


    def read_by_screen_name_and_pass_word screen_name, pass_word, ip
      # === Get stats for ip address.
      ip_row = IP_TABLE[:ip=>ip]

      if !ip_row
        ip_row = IP_TABLE.
          returning.
          insert(ip: ip).
          first
      end

      if ip_row[:bad_log_in_count] > 3
        raise Too_Many_Bad_Logins.new(Customer.new(), 'Too many bad log-ins for today. Try again tomorrow.')
      end

      c = read_by_screen_name(screen_name)

      new_attempt = TABLE.
        returning.
        where("log_in_at != ? AND id = ?", Ok::Model::PG::UTC_NOW_DATE, c.data[:id]).
        update(log_in_at: Ok::Model::PG::UTC_NOW_DATE, bad_log_in_count: 0).
        first

      if new_attempt
        c.data.merge! new_attempt
      else
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
        raise Wrong_Pass_Word.new(c, 'Pass phrase is incorrect. Check your CAPS LOCK key.')
      end

      c
    end # === def login

  end # === class self ===

end # === class Customer read ===





