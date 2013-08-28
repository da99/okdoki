
require 'httparty'

def get str
  HTTParty.get( 'https://localhost' + str )
end

server = nil

kill = lambda { |*a|
  `pkill -QUIT -f "unicorn master"`
  while `ps aux`['unicorn master']
    sleep 0.1
  end
  puts "Server killed"
}

Signal.trap("INT", kill)
Signal.trap("EXIT", kill)

kill.call


require 'pty'
catch :ready do
  begin
    PTY.spawn( "bin/start" ) do |stdin, stdout, pid|
      begin
        # Do stuff with the output here. Just printing to show it works
        stdin.each { |line|
          print line
          throw(:ready) if line['worker'] && line['read']
        }
      rescue Errno::EIO
        puts "Errno:EIO error, but this probably just means " +
          "that the process has finished giving output"
      end
    end
  rescue PTY::ChildExited
    puts "The child process exited!"
  end
end

puts "server started"


require 'Bacon_Colored'
describe "/" do

  it "returns a 200" do
    r = get "/"
    r.code.should == 200
  end

end # === describe it runs ===

