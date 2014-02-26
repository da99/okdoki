
class Screen_Name_Code_Consume

  class << self

    def read producer, consumer
      sql = %~
        SELECT *
        FROM screen_name_code
        WHERE

          " WHERE anyone can see them
          (
            is_on = TRUE
            AND
            producer_id =  :PRODUCER_ID
            AND
            event_name_id  IN (:EVENT_NAME_IDs)
          )

          OR

          " Where :producer can see them
          (
            is_on = TRUE
            AND
            producer_id =  :PRODUCER_ID
            AND
            producer_id =  :CONSUMER_ID
            AND
            event_name_id  IN (:EVENT_NAME_IDs)
          )

          OR

          " WHERE :consumer can see them
          (
            is_on = TRUE
            AND
            producer_id = :PRODUCER_ID
            AND
            event_name_id  IN (:EVENT_NAME_IDs)
            AND
            producer_id IN (
              SELECT producer_id
              FROM screen_name_code_consume
              WHERE
                    producer_id = :producer_id
                    AND
                    consumer_id = :consumer_id
              )
          )


        SELECT producer_id
        FROM screen_name_code_consume
        WHERE consumer_id = :consumer_id AND is_on = true
          " === LEFT JOIN screen_name
          " === LEFT JOIN


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





