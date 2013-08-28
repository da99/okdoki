require './tests/helpers'
include Server::Test
start_server


describe "/" do

  it "returns a 200" do
    c = new_client
    r = c.get "https://localhost/"
    r.code.to_i.should == 200
  end

end # === describe it runs ===




