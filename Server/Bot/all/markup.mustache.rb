<!DOCTYPE html>
<html lang="en">
  <head>
    <title>The Menu for Bots</title>
    <meta content="text/html charet=UTF-8" http-equiv="Content-Type" />
    <meta content="no-cache, max-age=0, must-revalidate, no-store, max-stale=0, post-check=0, pre-check=0" http-equiv="Cache-Control" />
    <link href="/favicon.ico" rel="shortcut icon" />
    <link href="/css/lenka-stabilo.css?{{file_stamp}}" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/circus.css?{{file_stamp}}" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/vanilla.reset.css?{{file_stamp}}" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/okdoki.css?{{file_stamp}}" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/forms.css?{{file_stamp}}" media="screen" rel="stylesheet" type="text/css" />
    <link href="/Bot/all/style.css?{{file_stamp}}" media="screen" rel="stylesheet" type="text/css" />
  </head>
  <body>{{#logged_in?}}    <div id="Nav_Bar"><a href="/" id="Go_Home">Go Back Home</a></div>
    {{/logged_in?}}    <div id="Sidebar">      <div id="Me_Intro">        <div class="the_life_of">A menu of...</div>
        <h3 class="name">bots.</h3>
      </div>
      <div class="box">
        <h3>Intro:</h3>
        <div class="content"><p>Here you can turn off/on various bots. Once you are done, go back <a href="/">home</a> to start using them.</p></div>
      </div>
    </div>
    <div id="bot_list">{{#bots}}      <div class="bot">        <div class="header"><a class="on  {{#is_on}}is_on{{/is_on}}" href="#on">on</a><a class="off {{^is_on}}is_off{{/is_on}}" href="#off">off</a><a class="name" href="{{href}}">{{screen_name}}</a></div>
        <input name="screen_name" type="hidden" value="{{screen_name}}" /></div>
      {{/bots}}</div>
    <script id="CSRF" type="text/_csrf">{{_csrf}}</script>
    <script id="js_templates" type="text/x-okdoki">      <div class="loading msg"></div>
      <div class="success msg"></div>
      <div class="errors msg"></div>
    </script>
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
    <script src="/Bot/all/script.js?{{file_stamp}}" type="text/javascript"></script>
  </body>
</html>
