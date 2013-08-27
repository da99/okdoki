
require 'Bacon_Colored'
require 'httparty'

def get str
  HTTParty.get( 'https://localhost' + str )
end

server = nil

kill = lambda { |*a|
  `pkill -QUIT -f "unicorn master"`
  sleep 0.2
}

kill.call

server = fork do
  exec "bin/start"
end

Process.detach(server)

Signal.trap("INT", kill)
Signal.trap("EXIT", kill)


sleep 1

describe "/" do

  it "returns a 200" do
    r = get "/"
    r.code.should == 200
  end

end # === describe it runs ===

