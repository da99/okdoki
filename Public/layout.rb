
STAMP = Time.now.to_i

module Dot_Why
  class Template

    def_sections :scripts, :styles, :js_templates

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

    def mustache name
      text "{{# #{name} }}"
      yield
      text "{{/ #{name} }}"
    end

    def applet *args
      section :styles do
        stylesheet "/applets/#{args.first}/style"
      end

      section :scripts do
        script "/applets/#{args.first}/script"
      end

      file_name = "Public/applets/#{args.first}/markup.rb"
      eval File.read(file_name), nil, file_name, 1
    end

    def title txt = nil
      if txt
        @_title = txt
      else
        super(@_title)
      end
    end

    def view_name
      @view_name ||= begin
                       name = main_file.sub('/markup.rb', '')
                       dir = File.basename(File.dirname name)
                       file = File.basename name
                       "#{dir}/#{file}"
                     end
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

          section :styles do
            stylesheet "/#{view_name}/style"
          end

          section :scripts do
            script "/#{view_name}/script"
          end

          section :styles

        end

        body do

          section :main

          script("{{_csrf}}", type: "text/_csrf", id: "CSRF")

          script(type: "text/x-okdoki", id: "js_templates") {
            div.loading.msg('')
            div.success.msg('')
            div.errors.msg('')
            section :js_templates
          }

          section :scripts, :top do
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
          end

          section :scripts
        end
      end
    end
  end

end # === module
