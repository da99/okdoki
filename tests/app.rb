require './tests/helpers'

include Server::Test
start_server


describe "/" do

  it "returns a 200" do
    r = get "/"
    r.code.should == 200
  end

end # === describe it runs ===




