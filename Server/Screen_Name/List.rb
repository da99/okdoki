
class Screen_Name

  class List # === Not called an Array to avoid confusion.

    include Ok::Model::List

    def initialize arr = nil
      @names = arr || []
    end # === def initialize

    def include? unknown
      name = if unknown.is_a? String
        unknown
      else
        unknown.data[:screen_name]
      end

      !!@names.detect { |sn| sn.is? name }
    end

    def [] raw_name
      @names.detect { |sn| sn.is? raw_name }
    end

    def names
      pluck :screen_name
    end

    def ids
      pluck :id
    end

  end # === class List ===

end # === class Screen_Name ===
