
module Okdoki
  class SQL_Code

    CTE_COLS = {
      Story    => [:mag_id, Magazine].freeze,
      Magazine => [:publisher_id, Screen_Name].freeze,
      Screen_Name => [:owner_id, Customer].freeze,
      Customer => [nil, nil].freeze
    }

    SQL_Templates = [
      # === TOP
      %~
        SELECT ? AS class_id, id, NULL AS parent_id
        FROM :klass
        WHERE id IN ( SELECT parent_id FROM :child_klass_parent )
      ~,

      # === MIDDLE
      %~
        SELECT ? AS class_id, id, ? AS parent_id
        FROM :klass
        WHERE id = ( SELECT parent_id FROM :child_klass_parent )
      ~,

      # === BOTTOM
      %~
        SELECT ? AS class_id, id, ? AS parent_id
        FROM :klass
        WHERE id = :klass_table
      ~
    ]

    def initialize klass, id
      @with   = []
      @sql    = []
      @args   = []
      @klass  = klass
      WITH(klass, id)
    end

    def to_sql
      sql        = []
      args       = []
      size       = @with.size
      last_index = size - 1
      @with.each_with_index { |meta, i|
        klass        = meta[1]
        child_klass  = @with[i + 1] && @with[i + 1][1]
        fkey_name    = meta[0][0]
        parent_klass = meta[0][1]
        id           = meta[2]
        template     = if i == 0
                         args << klass.okdoki_id
                         args << klass.table_name.to_s
                         args << "#{child_klass.to_s}_parent"
                         SQL_Templates[0]
                       elsif i != last_index
                         SQL_Templates[1]
                       else
                         SQL_Templates[2]
                       end
        sql << %!  #{ i != 0 ? ', ' : ''}
          :klass_parent AS (
            #{template}
          )
        !.gsub(':klass', klass.table_name.to_s)
        if child_klass
         sql.last.gsub!(':child_klass', child_klass.table_name.to_s)
        end
      }

      sql_str = %^
        WITH
          #{sql.join ', '}
        ,
        :klass_parent_child_tree AS (
          #{select.join '
            UNION
          '}
        )
      ^.gsub(':klass', @klass.table_name.to_s)
    end

    # =======================================================
    private
    # =======================================================

    def WITH klass, id
      @with.unshift [CTE_COLS[args.first], klass, id]
      parent = CTE_COLS[args.first].last
      WITH(parent, :unknown) if parent
      self
    end

    def SUB_SELECT col, table
      " SELECT '#{col}' FROM '#{table}' "
    end

  end # === class SQL_Code ===
end # === module Okdoki ===
