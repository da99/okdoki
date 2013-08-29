
STAMP = Time.now.to_i

module Dot_Why
  class Template

    class << self
      alias_method :def_section, :blocks
      alias_method :def_sections, :blocks
    end # === class self ===

    def view_name
      @view_name ||= begin
                       base = File.basename(main_file).sub(".rb", '')
                       dir  = File.dirname(main_file)
                       "#{dir}/#{base}"
                     end
    end

    def use_file name
      @files ||= {}
      raise "File already used: #{name.inspect}" if @files[name]
      @files[name] = true
      name
    end

    def as_this_life_menu
      select(name:"as_this_life") {
        text '{{# screen_names}}'
        option('{{name}}', value="{{name}}")
        text '{{/ screen_names}}'
      }
    end

    def span_as
      span.as_this_life {
        span.as " as: "
        as_this_life_menu()
      }
    end

    def applet *args
      styles {
        stylesheet "/applets/#{args.first}/style"
      }

      scripts {
        script "/applets/#{args.first}/script"
      }

      file_name = "Public/applets/#{args.first}/markup.rb"
      eval File.read(file_name), nil, file_name, 1
    end

    def_sections :scripts, :styles, :js_templates

    def script *args
      if args.size == 1 && args.first.is_a?(String)
        name = args.first
        full = "#{name}.js"
        super(:type=>"text/javascript", :src=>"#{use_file full}")
      else
        super
      end
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
      link(:rel=>'stylesheet', :type=>'text/css', :href=>use_file(filename), :media=>'screen')
    end

    def content
      eval_main

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

          styles { stylesheet "/#{view_name}/style" }

          scripts { script "/#{view_name}/script" }

          styles

        end

        body do

          main

          script("{{_csrf}}", type: "text/_csrf", id: "CSRF")

          script(type: "text/x-okdoki", id: "js_templates") {
            div.loading.msg('')
            div.success.msg('')
            div.errors.msg('')
            js_templates
          }

          scripts(:top) {
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
