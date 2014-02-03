
module Ok_Draw

  attr_reader :app

  def initialize app
    @app = app
  end

  def draw *names
    names.map { |n|
      const_name = "#{self.class}__#{n}"
      begin
        Object.const_get const_name
      rescue NameError => e
        require "./Server/#{const_name.gsub('__', '/')}/html.rb"
        Object.const_get const_name
      end
      .new(app).run
    }.join("<br />\n")
  end
end

class Scrap__Me

  def run app
    [:nav_bar, :body, :footer].each { |n|
      require "./Server/Scrap/Me/#{n}/html"
      Object.const_get("Scrap__Me__#{n}").new.run app
    }
    app.ok_data[:body].join("<br />\n")
  end

end # === class Scrap__Me ===





