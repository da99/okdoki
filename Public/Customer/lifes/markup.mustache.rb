"<!DOCTYPE html>\n<html lang=\"en\">\n  <head>\n    <title>#{        v = ctx[:title]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}</title>\n    <meta content=\"text/html charet=UTF-8\" http-equiv=\"Content-Type\" />\n    <meta content=\"no-cache, max-age=0, must-revalidate, no-store, max-stale=0, post-check=0, pre-check=0\" http-equiv=\"Cache-Control\" />\n    <link href=\"/favicon.ico\" rel=\"shortcut icon\" />\n    <link href=\"/css/lenka-stabilo.css?1377723313\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" />\n    <link href=\"/css/circus.css?1377723313\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" />\n    <link href=\"/css/vanilla.reset.css?1377723313\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" />\n    <link href=\"/css/okdoki.css?1377723313\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" />\n    <link href=\"/css/forms.css?1377723313\" media=\"screen\" rel=\"stylesheet\" type=\"text/css\" />\n  </head>\n  <body>    <div id=\"Logo\"><span class=\"main\">ok</span><span class=\"sub\">doki</span><span class=\"wat_wat\">: Multi-Life Chat & Publishing</span></div>\n    <div class=\"col\" id=\"Interact\">      <div class=\"box\" id=\"Create_Life\">        <div class=\"mini_box my_life\">\n          <h3>My Life(s):</h3>\n          <div class=\"content\">            <ul class=\"screen_names\">#{      if v = ctx[:screen_names]
        if v == true
          "\n              <li><a href=\"#{        v =           [:to_html].inject(ctx[:name]) { |value, key|
            value && ctx.find(value, key)
          }

        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}\">#{        v = ctx[:name]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}</a></li>\n              "
        elsif v.is_a?(Proc)
          t = Mustache::Template.new(v.call("\n              <li><a href=\"{{name.to_html}}\">{{name}}</a></li>\n              ").to_s)
          def t.tokens(src=@source)
            p = Parser.new
            p.otag, p.ctag = ["{{", "}}"]
            p.compile(src)
          end
          t.render(ctx.dup)
        else
          # Shortcut when passed non-array
          v = [v] unless v.is_a?(Array) || defined?(Enumerator) && v.is_a?(Enumerator)

          v.map { |h| ctx.push(h); r = "\n              <li><a href=\"#{        v =           [:to_html].inject(ctx[:name]) { |value, key|
            value && ctx.find(value, key)
          }

        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}\">#{        v = ctx[:name]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}</a></li>\n              "; ctx.pop; r }.join
        end
      end
}</ul>\n          </div>\n        </div>\n        <div class=\"mini_box create_life\">\n          <h3>Create A New Life:</h3>\n          <div class=\"content\">            <form action=\"/me\" id=\"Create_Screen_Name\" method=\"POST\">              <div class=\"fields\">                <div class=\"field screen_name\"><span class=\"label\">Screen Name:</span><input maxlength=\"40\" name=\"screen_name\" type=\"text\" value=\"\" /></div>\n                <div class=\"field sn_type\"><input name=\"type_id\" type=\"checkbox\" value=\"1\" />\n                  <label for=\"sn_type\"><span> It&#39;s for a thing: website, product, event, etc. </span></label>\n                </div>\n              </div>\n              <div class=\"buttons\"><button class=\"submit\">Create</button></div>\n            </form>\n          </div>\n        </div>\n      </div>\n      <div id=\"Options\">\n        <h2>Options for Eggheads</h2>\n        <div class=\"#{        v = ctx[:has_bots]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}\" id=\"New_Bot\">          <div class=\"setting\"><a class=\"on\" href=\"#show\">Show</a></div>\n          <h3>Create a Bot</h3>\n          <div class=\"content\">            <div class=\"list\">#{      if v = ctx[:bots]
        if v == true
          "<a href=\"/bot/#{        v = ctx[:name]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}\">#{        v = ctx[:name]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}</a>"
        elsif v.is_a?(Proc)
          t = Mustache::Template.new(v.call("<a href=\"/bot/{{name}}\">{{name}}</a>").to_s)
          def t.tokens(src=@source)
            p = Parser.new
            p.otag, p.ctag = ["{{", "}}"]
            p.compile(src)
          end
          t.render(ctx.dup)
        else
          # Shortcut when passed non-array
          v = [v] unless v.is_a?(Array) || defined?(Enumerator) && v.is_a?(Enumerator)

          v.map { |h| ctx.push(h); r = "<a href=\"/bot/#{        v = ctx[:name]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}\">#{        v = ctx[:name]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}</a>"; ctx.pop; r }.join
        end
      end
}</div>\n            #{      if v = ctx[:bots]
        if v == true
          "            <form action=\"/Bot\" id=\"Bot_Create\" method=\"POST\">              <div class=\"fields\">                <div class=\"field sub_sn\">\n                  <label for=\"NEW_BOT_SCREEN_NAME\">Screen Name:</label>\n<input id=\"NEW_BOT_SCREEN_NAME\" name=\"sub_sn\" type=\"text\" /></div>\n              </div>\n              <div class=\"buttons\"><span class=\"as_this_life\"><span class=\"as\"> as: </span><select name=\"as_this_life\">#{      if v = ctx[:screen_names]
        if v == true
          "\n                    <option>#{        v = ctx[:name]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}</option>\n                    "
        elsif v.is_a?(Proc)
          t = Mustache::Template.new(v.call("\n                    <option>{{name}}</option>\n                    ").to_s)
          def t.tokens(src=@source)
            p = Parser.new
            p.otag, p.ctag = ["{{", "}}"]
            p.compile(src)
          end
          t.render(ctx.dup)
        else
          # Shortcut when passed non-array
          v = [v] unless v.is_a?(Array) || defined?(Enumerator) && v.is_a?(Enumerator)

          v.map { |h| ctx.push(h); r = "\n                    <option>#{        v = ctx[:name]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}</option>\n                    "; ctx.pop; r }.join
        end
      end
}</select></span><button class=\"submit\">Create</button></div>\n            </form>\n            "
        elsif v.is_a?(Proc)
          t = Mustache::Template.new(v.call("            <form action=\"/Bot\" id=\"Bot_Create\" method=\"POST\">              <div class=\"fields\">                <div class=\"field sub_sn\">\n                  <label for=\"NEW_BOT_SCREEN_NAME\">Screen Name:</label>\n<input id=\"NEW_BOT_SCREEN_NAME\" name=\"sub_sn\" type=\"text\" /></div>\n              </div>\n              <div class=\"buttons\"><span class=\"as_this_life\"><span class=\"as\"> as: </span><select name=\"as_this_life\">{{# screen_names}}\n                    <option>{{name}}</option>\n                    {{/ screen_names}}</select></span><button class=\"submit\">Create</button></div>\n            </form>\n            ").to_s)
          def t.tokens(src=@source)
            p = Parser.new
            p.otag, p.ctag = ["{{", "}}"]
            p.compile(src)
          end
          t.render(ctx.dup)
        else
          # Shortcut when passed non-array
          v = [v] unless v.is_a?(Array) || defined?(Enumerator) && v.is_a?(Enumerator)

          v.map { |h| ctx.push(h); r = "            <form action=\"/Bot\" id=\"Bot_Create\" method=\"POST\">              <div class=\"fields\">                <div class=\"field sub_sn\">\n                  <label for=\"NEW_BOT_SCREEN_NAME\">Screen Name:</label>\n<input id=\"NEW_BOT_SCREEN_NAME\" name=\"sub_sn\" type=\"text\" /></div>\n              </div>\n              <div class=\"buttons\"><span class=\"as_this_life\"><span class=\"as\"> as: </span><select name=\"as_this_life\">#{      if v = ctx[:screen_names]
        if v == true
          "\n                    <option>#{        v = ctx[:name]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}</option>\n                    "
        elsif v.is_a?(Proc)
          t = Mustache::Template.new(v.call("\n                    <option>{{name}}</option>\n                    ").to_s)
          def t.tokens(src=@source)
            p = Parser.new
            p.otag, p.ctag = ["{{", "}}"]
            p.compile(src)
          end
          t.render(ctx.dup)
        else
          # Shortcut when passed non-array
          v = [v] unless v.is_a?(Array) || defined?(Enumerator) && v.is_a?(Enumerator)

          v.map { |h| ctx.push(h); r = "\n                    <option>#{        v = ctx[:name]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}</option>\n                    "; ctx.pop; r }.join
        end
      end
}</select></span><button class=\"submit\">Create</button></div>\n            </form>\n            "; ctx.pop; r }.join
        end
      end
}</div>\n        </div>\n      </div>\n    </div>\n    <div class=\"col\" id=\"Msgs\">      <div id=\"Headlines\"></div>\n    </div>\n    <script id=\"CSRF\" type=\"text/_csrf\">#{        v = ctx[:_csrf]
        if v.is_a?(Proc)
          v = Mustache::Template.new(v.call.to_s).render(ctx.dup)
        end
        ctx.escapeHTML(v.to_s)
}</script>\n    <script id=\"templates\" type=\"text/x-okdoki\">      <div class=\"loading msg\"></div>\n      <div class=\"success msg\"></div>\n      <div class=\"errors msg\"></div>\n      <li class=\"screen_name\"><a class=\"name\" href=\"/me/{name}\"></a></li>\n    </script>\n    <script src=\"/js/vendor/all.js\" type=\"text/javascript\"></script>\n    <script src=\"/js/Common.js\" type=\"text/javascript\"></script>\n    <script src=\"/js/Box.js\" type=\"text/javascript\"></script>\n    <script src=\"/js/Event.js\" type=\"text/javascript\"></script>\n    <script src=\"/js/DOM.js\" type=\"text/javascript\"></script>\n    <script src=\"/js/Ajax.js\" type=\"text/javascript\"></script>\n    <script src=\"/js/Adaptive.js\" type=\"text/javascript\"></script>\n    <script src=\"/js/Time.js\" type=\"text/javascript\"></script>\n    <script src=\"/js/Template.js\" type=\"text/javascript\"></script>\n    <script src=\"/js/Form.js\" type=\"text/javascript\"></script>\n    <script src=\"/js/Screen_Name.js\" type=\"text/javascript\"></script>\n    <script src=\"/js/Customer.js\" type=\"text/javascript\"></script>\n    <script src=\"/applets/Create_Life/script.js\" type=\"text/javascript\"></script>\n    <script src=\"/applets/Bot_Create/script.js\" type=\"text/javascript\"></script>\n  </body>\n</html>\n"
