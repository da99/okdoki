
module Ok
  module Model
    module List

      include ::Enumerable

      def pluck key
        @names.map { |n| n.data[key] }
      end

      def each
        @names.each { |n| yield n }
      end

      def push *args
        @names.concat args.flatten
        @names
      end

    end # === module Enumerable ===
  end # === module Model ===
end # === module Ok ===
