
require './Server/Customer/model'
require 'Bacon_Colored'
require 'mechanize'

IP = '127.0.0.1'

def customer
  Customer.new(:data)
end

def less_than x
  lambda { |o| o < x }
end

def within_secs x
  lambda { |o|
    o.class.should.equal Time
    !!o && (Time.now.utc.to_i - o.to_i).abs < x
  }
end

class Screen_Name
  module Test

    def new_name
      @i ||= begin
               r = Screen_Name::TABLE.order(:id).last
               (r && r[:screen_name].split('_').last.to_i) || 1
             end
      @i += 1
      "ted_#{@i}"
    end

    def create
      name = new_name
      c = Customer.new(data: 0)
      sn = Screen_Name.create(:screen_name=>name, :customer=>c)
      {name: name, c: c, sn: sn, id: sn.data[:id]}
    end

    def find_record o
      Screen_Name::TABLE[id: o[:sn].data[:id]]
    end

  end
end # === class Screen_Name ===

class Customer

  module Test

    include Screen_Name::Test

    # def delete_all
      # Customer::TABLE.delete
      # Screen_Name::TABLE.delete
    # end

    def create
      sn = new_name
      c = Customer.create screen_name: sn,
        pass_word: "this is a pass",
        confirm_pass_word: "this is a pass",
        ip: '000.00.000'
      {c: c, sn: sn, pw: "this is a pass"}
    end

  end # === module Test ===

end # === class Customer ===

def should_args action, *args
  case action
  when :zero, 0
    [ args.shift, [], :==, [0] ]
  when :one, 1
    [ args.shift, [], :==, [1] ]
  when Proc
    [ args.shift, [], nil, [action] ]
  else
    expect = args.shift
    actual = args.shift
    [ actual, [], action, args.unshift(expect) ]
  end
end

def assert *args
  make_should *should_args(*args)
end

def assert_not old_args
  args = should_args(*old_args)
  args[1].push :not
  make_should *args
end

def make_should o, bes_nots, meth, args
  s = Should.new(o)
  (bes_nots || []).each { |m|
    s = s.send(m)
  }

  if meth
    s.be.send(meth, *args)
  else
    s.be(*args)
  end
end



module Server
  module Test

    def client
      @client ||= begin
                    puts "New client"
                    agent = Mechanize.new
                    # http://icfun.blogspot.com/2012/05/ruby-opensslsslsslerror-with-mechanize.html
                    agent.agent.http.verify_mode = OpenSSL::SSL::VERIFY_NONE
                    @_get = agent.get('https://localhost/')
                    agent
                  end
    end

    def _csrf
      @_csrf ||= (@_get / '#CSRF').first.content
    end

    def GET url, *args
      client.get "https://localhost#{url}", *args
    end

    def POST url, data, headers = {}
      data = MultiJson.dump(data)
      headers['Cookie'] = @_get.header['set-cookie']
      headers['Content-Type'] = 'application/json'
      headers['X-CSRF-Token'] = _csrf if !headers.has_key?('X-CSRF-Token')
      client.post "https://localhost#{url}", data, headers
    end

    def tests_started? *args
      if args.empty?
        @started
      else
        @started = args.first
      end
    end


    def start_server
      # `pkill -HUP -f "unicorn master"`
      # require 'pty'

      # f = nil

      # kill = lambda { |*a|
        # old = `ps aux`['unicorn master']
        # `pkill -QUIT -f "unicorn master"`
        # f.resume if f && tests_started?
        # puts "=== Server killed\n\n" if old
      # }

      # Signal.trap("INT", lambda { 
        # kill.call
        # exit
      # })
      # Signal.trap("EXIT", lambda { 
        # kill.call
        # exit
      # })

      # kill.call


      # catch :ready do
      # # f = Fiber.new {
        # PTY.spawn( "bin/start" ) do |stdin, stdout, pid|
        # begin
          # # Do stuff with the output here. Just printing to show it works
          # stdin.each { |line|
            # print line #if line['app error']
            # # Fiber.yield if tests_started? || (line['worker'] && line['read'])
            # throw :ready if (line['worker'] && line['read'])
          # }
        # rescue Errno::EIO
          # exit 1 if !tests_started?
          # # puts "=== Server output has ended.\n\n"
          # Fiber.yield
        # end
        # end
      # # }
      # end

      # # f.resume

      # tests_started? true

    end # === def start_server


  end # === module Test ===
end # === module Server ===












































