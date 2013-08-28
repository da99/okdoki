require './tests/helpers'
require 'multi_json'
include Server::Test
start_server


Home = get "/"
csrf = (Home/'#CSRF').first
if csrf
  csrf = csrf.content
end

describe "/" do

  it "returns a 200" do
    Home.code.to_i.should == 200
  end

  it "includes a _csrf value" do
    (Home / "#CSRF").size.should == 1
  end

end # === describe it runs ===


describe "POST /user" do

  it "creates a new user" do
puts csrf
    r = post(
      "/user",
      MultiJson.dump({'_csrf' => csrf, 'screen_name'=>'ted1', 'pass_phrase'=>'this is mey  passw'}),
      'Content-Type'=>'application/json'
    )
    r.code.to_i.should == 200
    r.body.should == "test"
  end

end # === describe

