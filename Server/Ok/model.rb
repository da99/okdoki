require 'sequel'
DB = Sequel.connect(ENV['DATABASE_URL'])

require './Server/Ok/Validate'
require './Server/Ok/Helpers'
require './Server/Ok/List'

CRUTD_Actions = [:create, :read, :update, :trash, :delete]

def require_crutd klass
  CRUTD_Actions.each { |action|
    require "./Server/#{klass}/model/#{action}"
  }
end

module Ok

  # =====================================================
  # Errors
  # =====================================================

  class Invalid < RuntimeError

    attr_reader :model, :msg

    def initialize o, msg
      @model = o
      @msg   = msg
      super(msg)
    end

  end # === class Invalid ===

  class Not_Found < RuntimeError

    def initialize msg = nil
      if !msg
        msg = "Not found."
      elsif !msg.kind_of? String
        msg = "#{msg.class} not found."
      end
      @msg = msg
      super(@msg)
    end

  end # === class Not_Found ===

  # =====================================================
  # Modules
  # =====================================================

  module Model_Extend

    def create new_data
      m = new
      m.create new_data
      m
    end

  end # === module Model_Extend ===

  # =====================================================
  # Model (the main stuff)
  # =====================================================

  module Model

    attr_reader :data, :clean_data, :new_data

    class << self

      def included klass
        klass.extend Model_Extend
      end

    end # === class self ===

    def validate name
      @spec = name
      if new_data.has_key?(name)
        Ok::Validate.new(self, name)
      else
        Ok::Validate_Empty.new(self, name)
      end
    end

    def initialize *args
      if args.empty?
        @data = {}
      elsif args.size == 1
        @data = args.first || {}
      else
        @data = args.first || {}
        if !@data # === record was not found
          raise Not_Found.new(args.last)
        end
      end
    end

  end # === module Model ===

end # === module Ok ===














