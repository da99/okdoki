
module Ok
  module Model
    module List

      include ::Enumerable

      def pluck key
        @list.map { |n| n.data[key] }
      end

      def each
        @list.each { |n| yield n }
      end

      def push *args
        @list.concat args.flatten
        @list
      end

    end # === module Enumerable ===
  end # === module Model ===
end # === module Ok ===
