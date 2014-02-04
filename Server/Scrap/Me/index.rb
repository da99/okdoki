
module Logic_For

  def logic_for sub_path, app
    path = "./Server/#{sub_path}"
    name = sub_path.gsub('/', '__')
    klass = begin
              Object.const_get name
            rescue NameError => e
              require "#{path}/index"
              Object.const_get name
            end


    klass.partials.each { |name|
      p_name = "#{klass}__#{name}"
      p_klass = begin
                  Object.const_get p_name
                rescue NameError => e
                  require "#{path}/#{name}/logic"
                  Object.const_get p_name
                end
      p_klass.new.run app
    }
  end

end # === module Logic_For ===

class Scrap__Me

  include Logic_For

  class << self

    def partials
      [:nav_bar, :body, :footer]
    end

  end # === class self ===

  def run app
    logic_for "Scrap/Me", app
    app.client_data[:body].join("<br />\n")
  end

end # === class Scrap__Me ===





