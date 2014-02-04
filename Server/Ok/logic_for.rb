
class Logic_For_Cache
  class << self
    def read sub_path
      @cache ||= {}
      @cache[sub_path] ||= begin
                             raw = File.read("./Server/#{sub_path}/order.txt")
                             raw.split.map(&:strip)
                             .reject { |s| s.empty? }
                           end
    end
  end # === class self ===
end # === class Logic_For_Cache

helpers do

  def partials_list_for sub_path
    Logic_For_Cache.read(sub_path)
  end

  def logic_for sub_path
    app  = self
    path = "./Server/#{sub_path}"
    name = sub_path.gsub('/', '__')
    partials = partials_list_for(sub_path)

   partials.each { |p_name|
      p_klass_name = "#{name}__#{p_name}"
      p_klass = begin
                  Object.const_get p_klass_name
                rescue NameError => e
                  require "#{path}/#{p_name}/logic"
                  Object.const_get p_klass_name
                end
      p_klass.new.run app
    }
  end


end # === helpers
