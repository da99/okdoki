<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{{intro}} {{sn_all}}</title>
    <meta content="text/html charet=UTF-8" http-equiv="Content-Type" />
    <meta content="no-cache, max-age=0, must-revalidate, no-store, max-stale=0, post-check=0, pre-check=0" http-equiv="Cache-Control" />
    <link href="/favicon.ico" rel="shortcut icon" />
    <link href="/css/lenka-stabilo.css?{{file_stamp}}" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/circus.css?{{file_stamp}}" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/vanilla.reset.css?{{file_stamp}}" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/okdoki.css?{{file_stamp}}" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/forms.css?{{file_stamp}}" media="screen" rel="stylesheet" type="text/css" />
    <link href="/Screen_Name/me/style.css?{{file_stamp}}" media="screen" rel="stylesheet" type="text/css" />
  </head>
  <body>{{#logged_in?}}    <div id="Nav_Bar"><a href="/log-out" id="Log_Out">Log-out</a></div>
    {{/logged_in?}}    <div id="Me">      <div class="box">
        <h3><span>Message Board</span><span class="sub">(Low Priority Messages)</span></h3>
        <div class="content">No messages so far.</div>
      </div>
    </div>
    <div id="Sidebar">      <div id="Me_Intro">        <div class="the_life_of">{{intro}}...</div>
        <h3 class="name">{{sn_all}}</h3>
      </div>
      <div class="box">
        <h3>How to use Okdoki.com:</h3>
        <div class="content"><p>Write a message below.</p><p>Find some people or publications to follow:<br />
          <a href="/lifes">official Okdoki lifes</a></p><p>Find some people or publications to follow:<br />
          <a href="/lifes">official Okdoki lifes</a></p>
          <p>Your home page(s):</p>
          <ul>{{#screen_names}}<a href="{{href}}">{{screen_name}}</a></li>
            {{/screen_names}}</ul>
        </div>
      </div>
    </div>
    <script id="CSRF" type="text/_csrf">{{_csrf}}</script>
    <script id="js_templates" type="text/x-okdoki">      <div class="loading msg"></div>
      <div class="success msg"></div>
      <div class="errors msg"></div>
      {{#is_owner}}      <div class="customer_screen_names">{{sn_all}}</div>
      <div class="msg">        <div class="meta"><span class="author"></span><a href="{href}">{sn}</a><span class="said">said:</span></div>
        <div class="content">{body}</div>
      </div>
      <div class="msg me_msg">        <div class="meta"><span class="author">{sn} (me)</span><span class="said">said:</span></div>
        <div class="content">{body}</div>
      </div>
      <div class="msg chat_msg">        <div class="meta"><span class="author">{sn}</span><span class="said">said:</span></div>
        <div class="content">{body}</div>
      </div>
      <div class="msg chat_msg me_chat_msg">        <div class="meta"><span class="author">{sn} (me)</span><span class="said">said:</span></div>
        <div class="content">{body}</div>
      </div>
      <div class="msg official chat_msg">        <div class="content">{body}</div>
      </div>
      <div class="msg official chat_msg errors">        <div class="content">{body}</div>
      </div>
      {{/is_owner}}</script>
    <script src="/js/vendor/all.js?{{file_stamp}}" type="text/javascript"></script>
    <script src="/js/Common.js?{{file_stamp}}" type="text/javascript"></script>
    <script src="/js/Box.js?{{file_stamp}}" type="text/javascript"></script>
    <script src="/js/Event.js?{{file_stamp}}" type="text/javascript"></script>
    <script src="/js/DOM.js?{{file_stamp}}" type="text/javascript"></script>
    <script src="/js/Ajax.js?{{file_stamp}}" type="text/javascript"></script>
    <script src="/js/Adaptive.js?{{file_stamp}}" type="text/javascript"></script>
    <script src="/js/Time.js?{{file_stamp}}" type="text/javascript"></script>
    <script src="/js/Template.js?{{file_stamp}}" type="text/javascript"></script>
    <script src="/js/Form.js?{{file_stamp}}" type="text/javascript"></script>
    <script src="/js/Screen_Name.js?{{file_stamp}}" type="text/javascript"></script>
    <script src="/js/Customer.js?{{file_stamp}}" type="text/javascript"></script>
    <script src="/Screen_Name/me/script.js?{{file_stamp}}" type="text/javascript"></script>
  </body>
</html>
