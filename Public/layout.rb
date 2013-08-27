
STAMP = Time.now.to_i

module Dot_Why
  class Template

    def applet *args
      file_name = "Public/applets/#{args.first}/markup.rb"
      eval File.read(file_name), nil, file_name, 1 
    end

    blocks :scripts

    def script name
      full = "#{name}.js"
      super(:type=>"text/javascript", :src=>"#{full}")
    end

    def title txt = nil
      if txt
        @_title = txt
      else
        super(@_title)
      end
    end

    def stylesheet name
      filename = if name[/\:/]
                   name
                 else
                   if name['/']
                      "#{name}.css?#{STAMP}"
                    else
                      "/css/#{name}.css?#{STAMP}"
                    end
                 end
      link(:rel=>'stylesheet', :type=>'text/css', :href=>filename, :media=>'screen')
    end

    def content
      rawtext "<!DOCTYPE html>"
      html(:lang=>'en') do
        head do
          title
          meta(:"http-equiv"=>"Content-Type",  :content=>"text/html charet=UTF-8" )
          meta(:"http-equiv"=>"Cache-Control", :content=>"no-cache, max-age=0, must-revalidate, no-store, max-stale=0, post-check=0, pre-check=0" )
          link(:rel=>'shortcut icon', :href=>'/favicon.ico')

          stylesheet 'lenka-stabilo'
          stylesheet 'circus'
          stylesheet 'vanilla.reset'
          stylesheet 'okdoki'
          stylesheet 'forms'

          styles
        end
        body do
          main
          scripts {
            script('/js/vendor/all')

            script("/js/Common")
            script("/js/Box")
            script("/js/Event")
            script("/js/DOM")
            script("/js/Ajax")
            script("/js/Adaptive")
            script("/js/Time")
            script("/js/Template")
            script("/js/Form")

            script("/js/Screen_Name")
            script("/js/Customer")
          }

          scripts
        end
      end
    end
  end
end # === module
