require 'sequel'
DB = Sequel.connect(ENV['DATABASE_URL'])

require './Server/Ok/Validate'
require './Server/Ok/Helpers'

module Ok

  class Invalid < RuntimeError

    attr_reader :model, :msg

    def initialize o, msg
      @model = o
      @msg   = msg
      super(msg)
    end

  end # === class Invalid ===

  module Model_Extend

    def create new_data
      m = new
      m.create new_data
      m
    end

  end # === module Model_Extend ===

  module Model

    attr_reader :data, :clean_data, :new_data

    class << self

      def included klass
        klass.extend Model_Extend
      end

    end # === class self ===

    def validate name
      @spec = name
      v = nil
      if clean_data.has_key?(name)
        v = Ok::Validate.new(self, name)
      else
        v = Ok::Validate_Empty.new(self, name)
      end
      v
    end

    def initialize data = nil
      @data = data || {}
    end

  end # === module Model ===

end # === module Ok ===














