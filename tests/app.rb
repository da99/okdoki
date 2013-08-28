
require 'pty'
require 'httparty'

def get str
  HTTParty.get( 'https://localhost' + str )
end

Record = { started: false }

f = nil

kill = lambda { |*a|
  old = `ps aux`['unicorn master']
  `pkill -QUIT -f "unicorn master"`
  f.resume if f && Record[:started] # = throw(:ready)
  puts "=== Server killed\n\n" if old
}

Signal.trap("INT", kill)
Signal.trap("EXIT", kill)

kill.call


f = Fiber.new {
  PTY.spawn( "bin/start" ) do |stdin, stdout, pid|
    begin
      # Do stuff with the output here. Just printing to show it works
      stdin.each { |line|
        print line
        Fiber.yield if line['worker'] && line['read']
        # throw(:ready) if line['worker'] && line['read']
      }
    rescue Errno::EIO
      exit 1 if !Record[:started]
      # puts "=== Server output has ended.\n\n"
      Fiber.yield
    end
  end
}

f.resume

Record[:started] = true


require 'Bacon_Colored'
describe "/" do

  it "returns a 200" do
    r = get "/"
    r.code.should == 200
  end

end # === describe it runs ===




