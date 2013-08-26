
class I_Know_Them

  attr_reader :target, :owner

  %w{ id owner_id target_id is_follow is_block is_talk_able }.each { |name|
    eval %!
      def #{name}
        data[:#{name}]
      end
    !
  }

end # === class I_Know_Them read ===





