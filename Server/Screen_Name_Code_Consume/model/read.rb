
class Screen_Name_Code_Consume

  class << self

    def read producer, consumer
      sql = %~
        " === Get ALL subscriptions
        " === Get any where :anyone can see them.
        " === Filter out the ones not allowed.
              " :no_one
              " :producer
              " :is_on == false
        " === Affordable Optimization.

        SELECT producer_id
        FROM screen_name_code_consume
        WHERE consumer_id = :consumer_id AND is_on = true
          " === LEFT JOIN screen_name
          " === LEFT JOIN

        UNION DISTINCT

        SELECT *
        FROM screen_name_code
        WHERE screen_name_id = :producer_id AND who_id = :anyone

      ~
    end

  end # === class self ===

  def producer_id
    data[:producer_id]
  end

  def consumer_id
    data[:consumer_id]
  end

end # === class Screen_Name_Code_Consume read ===





