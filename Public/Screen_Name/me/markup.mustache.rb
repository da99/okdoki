<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{{title}}</title>
    <meta content="text/html charet=UTF-8" http-equiv="Content-Type" />
    <meta content="no-cache, max-age=0, must-revalidate, no-store, max-stale=0, post-check=0, pre-check=0" http-equiv="Cache-Control" />
    <link href="/favicon.ico" rel="shortcut icon" />
    <link href="/css/lenka-stabilo.css?1377782317" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/circus.css?1377782317" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/vanilla.reset.css?1377782317" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/okdoki.css?1377782317" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/forms.css?1377782317" media="screen" rel="stylesheet" type="text/css" />
    <link href="/applets/Bot_Create/style.css?1377782317" media="screen" rel="stylesheet" type="text/css" />
    <link href="/Screen_Name/me/style.css?1377782317" media="screen" rel="stylesheet" type="text/css" />
  </head>
  <body>    <div id="Me">      <div class="box">
        <h3><span>Box</span><span class="sub">(Mail)</span></h3>
        <div class="content">[placeholder]</div>
      </div>
    </div>
    <div id="Sidebar">      <div id="Me_Intro">        <div class="the_life_of">The life of...</div>
        <h3 class="name">{{screen_name.screen_name}}</h3>
      </div>
      <div class="box">
        <h3>~ ~ ~</h3>
        <div class="content">* * *</div>
      </div>
      {{^bot}}      <div class="box" id="New_Bot">        <div class="setting"><a class="on" href="#show">Show</a></div>
        <h3>Create a Bot</h3>
        <div class="content">          <form action="/Bot" id="Bot_Create" method="POST">            <div class="fields">              <div class="field sub_sn">
                <label for="NEW_BOT_SCREEN_NAME">Screen Name:</label>
<input id="NEW_BOT_SCREEN_NAME" name="sub_sn" type="text" /></div>
            </div>
            <div class="buttons"><input name="as_this_life" type="hidden" value="{{screen_name.screen_name}}" /><button class="submit">Create</button></div>
          </form>
        </div>
      </div>
      {{/bot}}</div>
    <script id="CSRF" type="text/_csrf">{{_csrf}}</script>
    <script id="js_templates" type="text/x-okdoki">      <div class="loading msg"></div>
      <div class="success msg"></div>
      <div class="errors msg"></div>
      {{#is_owner}}      <div class="msg">        <div class="meta"><span class="author"></span><a href="/me/{author_screen_name}">{author_screen_name}</a><span class="said">said:</span></div>
        <div class="content">{body}</div>
      </div>
      <div class="msg me_msg">        <div class="meta"><span class="author">{author_screen_name} (me)</span><span class="said">said:</span></div>
        <div class="content">{body}</div>
      </div>
      <div class="msg chat_msg">        <div class="meta"><span class="author">{author_screen_name}</span><span class="said">said:</span></div>
        <div class="content">{body}</div>
      </div>
      <div class="msg chat_msg me_chat_msg">        <div class="meta"><span class="author">{author_screen_name} (me)</span><span class="said">said:</span></div>
        <div class="content">{body}</div>
      </div>
      <div class="msg official chat_msg">        <div class="content">{body}</div>
      </div>
      <div class="msg official chat_msg errors">        <div class="content">{body}</div>
      </div>
      {{/is_owner}}</script>
    <script src="/js/vendor/all.js" type="text/javascript"></script>
    <script src="/js/Common.js" type="text/javascript"></script>
    <script src="/js/Box.js" type="text/javascript"></script>
    <script src="/js/Event.js" type="text/javascript"></script>
    <script src="/js/DOM.js" type="text/javascript"></script>
    <script src="/js/Ajax.js" type="text/javascript"></script>
    <script src="/js/Adaptive.js" type="text/javascript"></script>
    <script src="/js/Time.js" type="text/javascript"></script>
    <script src="/js/Template.js" type="text/javascript"></script>
    <script src="/js/Form.js" type="text/javascript"></script>
    <script src="/js/Screen_Name.js" type="text/javascript"></script>
    <script src="/js/Customer.js" type="text/javascript"></script>
    <script src="/applets/Bot_Create/script.js" type="text/javascript"></script>
    <script src="/Screen_Name/me/script.js" type="text/javascript"></script>
  </body>
</html>
