
require './Server/Permission/model'

class Chit_Chat

  attr_reader :from

  class << self

    def last_read_for u
      case
      when Customer
        TABLE_LAST_READ.where(sn_id: u.screen_names.ids).all
      when Screen_Name
        TABLE_LAST_READ.where(sn_id: u.id).first
      else
        raise "Unknown type: #{u.class}"
      end
    end

    def read_inbox sn
      %^
coalesce(MIN(last_read_at), timestamp '2001-09-28 01:00')
      ^


      recs = DB[%^
SELECT stats.*
FROM (

  -- Gather up the stats.
  -- This filters out the rows so we can then
  --   do joins or sub-queries for the follow/screen_name permissions.

  SELECT
         COUNT(chit_chat.pub_id)  AS count_new,
         chit_chat.pub_id         AS pub_id,
         MAX(chit_chat.created_at) AS last_post_at

  FROM chit_chat

    INNER JOIN follow
    ON pub_class_id               = :follow_pub_class_id   -- replace
       AND chit_chat.pub_id      = follow.pub_id
       AND follower_id           = :sn_id                -- replace
       AND chit_chat.created_at >= coalesce(follow.last_read_at, follow.created_at)

  GROUP BY chit_chat.pub_id
  ORDER BY last_post_at DESC

) AS stats

    INNER JOIN screen_name
    ON stats.pub_id = screen_name.id

    LEFT JOIN permission
    ON permission.pub_class_id    = :perm_pub_class_id -- replace
      AND stats.pub_id           = permission.pub_id
      AND to_id                  = :sn_id            -- replace


 WHERE screen_name.privacy = :sn_world       -- replace
   OR (
     screen_name.privacy = :sn_private       -- replace
     AND permission.to_id = :sn_world        -- replace
   )

  ORDER BY stats.last_post_at DESC           -- Ordering should be re-done since
                                             --   we are doing joins after select/where/aggregation
      ^,
        sn_id: sn.id,
        perm_pub_class_id: Permission::Screen_Name_Class_Id,
        follow_pub_class_id: Follow::Screen_Name_Class_Id,
        sn_world: Screen_Name::World_Read_Id,
        sn_private: Screen_Name::Private_Read_Id
      ].limit(111).all
    end

    def read_public_inbox sn
      new DB[%^
        SELECT *
        FROM chit_chat
        WHERE id IN (
          SELECT DISTINCT chit_chat_id
          FROM chit_chat_to
          WHERE pub_id =  :sn_id AND to_id IS NULL
          ORDER BY chit_chat.id DESC
        )
      ^, sn_id: sn.id].limit(111).all
    end

  end # === class self ===

  %w{ id pub_id author_id body cc_count }.each { |n|
    eval %^
      def #{n}
        data[:#{n}]
      end
    ^
  }

end # === class Chit_Chat read ===





