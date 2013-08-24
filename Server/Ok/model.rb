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
  # Helpers
  # =====================================================

  class << self
  end # === class self ===


  # =====================================================
  # Modules
  # =====================================================

  module Model_Extend

    def new *args
      if args.size == 1 && args.first.is_a?(Array)
        args.first.map { |r|
          super(r)
        }
      else
        super
      end
    end

    def create new_data
      m = new
      m.create new_data
      m
    end

    def empty_trash
      self::TABLE.
        where("trashed_at <= (timezone('UTC'::text, now()) - interval '72 hours')").
        delete
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
        klass.const_set :Not_Found, Class.new(Not_Found)
        klass.const_set :Invalid,   Class.new(Invalid)
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
      @clean_data = {}
      @new_data   = {}

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

    def trash
      alter_trash :in
    end

    def untrash
      alter_trash :out
    end

    def alter_trash into_trash
      key =  self.class::TRASH_KEY
      val = into_trash == :in ? Sequel.lit("timezone('UTC'::text, now())") : nil
      row = self.class::TABLE.
        returning.
        where( key => data[key] ).
        update(:trashed_at => val).
        first
      @data.merge!( row ) if row
      self
    end

  end # === module Model ===

end # === module Ok ===














