

class Scrap__Me

  class << self

    def partials
      [:nav_bar, :body, :footer]
    end

  end # === class self ===

  def run app
    [:nav_bar, :body, :footer].each { |n|
      require "./Server/Scrap/Me/#{n}/html"
      Object.const_get("Scrap__Me__#{n}").new.run app
    }
    app.ok_data[:body].join("<br />\n")
  end

end # === class Scrap__Me ===





