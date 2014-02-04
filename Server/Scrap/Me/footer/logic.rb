
class Scrap__Me__footer

  def run app
    # app.halt 402, {'Content-Type' => 'text/plain'}, 'victory'
    app.client_data[:body] << "3 footer"
  end
end

