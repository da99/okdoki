
class Screen_Name

  class List

    include Enumerable

    def initialize arr = nil
      @names = arr || []
    end # === def initialize

    def each
      @names.each { |n| yield n }
    end

    def push *args
      args.flatten.each { |a|
        @names.push a
      }
      @names
    end

  end # === class List ===

end # === class Screen_Name ===
