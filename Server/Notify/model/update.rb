
class Notify

  class << self

    def update_last_read_at from, to
      row = Notify::TABLE
      .returning
      .where(:from_id=>from.id, :to_id=>to.id)
      .update(:last_read_at=>Sequel.lit("timezone('UTC'::text, now())"))
      .first

      row && new(row)
    end

  end # === class self ===

end # === class Notify update ===





