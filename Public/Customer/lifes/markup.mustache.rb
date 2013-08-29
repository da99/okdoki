<!DOCTYPE html>
<html lang="en">
  <head>
    <title>{{title}}</title>
    <meta content="text/html charet=UTF-8" http-equiv="Content-Type" />
    <meta content="no-cache, max-age=0, must-revalidate, no-store, max-stale=0, post-check=0, pre-check=0" http-equiv="Cache-Control" />
    <link href="/favicon.ico" rel="shortcut icon" />
    <link href="/css/lenka-stabilo.css?1377776753" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/circus.css?1377776753" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/vanilla.reset.css?1377776753" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/okdoki.css?1377776753" media="screen" rel="stylesheet" type="text/css" />
    <link href="/css/forms.css?1377776753" media="screen" rel="stylesheet" type="text/css" />
    <link href="/applets/Create_Life/style.css?1377776753" media="screen" rel="stylesheet" type="text/css" />
    <link href="/applets/Bot_Create/style.css?1377776753" media="screen" rel="stylesheet" type="text/css" />
    <link href="/Customer/lifes/style.css?1377776753" media="screen" rel="stylesheet" type="text/css" />
  </head>
  <body>    <div id="Logo"><span class="main">ok</span><span class="sub">doki</span><span class="wat_wat">: Multi-Life Chat & Publishing</span></div>
    <div class="col" id="Interact">      <div class="box" id="Create_Life">        <div class="mini_box my_life">
          <h3>My Life(s):</h3>
          <div class="content">            <ul class="screen_names">{{# screen_names }}
              <li><a href="{{href}}">{{name}}</a></li>
              {{/ screen_names }}</ul>
          </div>
        </div>
        <div class="mini_box create_life">
          <h3>Create A New Life:</h3>
          <div class="content">            <form action="/me" id="Create_Screen_Name" method="POST">              <div class="fields">                <div class="field screen_name"><span class="label">Screen Name:</span><input maxlength="40" name="screen_name" type="text" value="" /></div>
                <div class="field sn_type"><input name="type_id" type="checkbox" value="1" />
                  <label for="sn_type"><span> It&#39;s for a thing: website, product, event, etc. </span></label>
                </div>
              </div>
              <div class="buttons"><button class="submit">Create</button></div>
            </form>
          </div>
        </div>
      </div>
      <div id="Options">
        <h2>Options for Eggheads</h2>
        <div class="box {{has_bots}}" id="New_Bot">          <div class="setting"><a class="on" href="#show">Show</a></div>
          <h3>Create a Bot</h3>
          <div class="content">            <div class="list">{{# bots }}<a href="{{href}}">{{name}}</a>{{/ bots }}</div>
            <form action="/Bot" id="Bot_Create" method="POST">              <div class="fields">                <div class="field sub_sn">
                  <label for="NEW_BOT_SCREEN_NAME">Screen Name:</label>
<input id="NEW_BOT_SCREEN_NAME" name="sub_sn" type="text" /></div>
              </div>
              <div class="buttons"><span class="as_this_life"><span class="as"> as: </span><select name="as_this_life">{{# screen_names}}
                    <option>{{name}}</option>
                    {{/ screen_names}}</select></span><button class="submit">Create</button></div>
            </form>
          </div>
        </div>
      </div>
    </div>
    <div class="col" id="Msgs">      <div id="Headlines"></div>
    </div>
    <script id="CSRF" type="text/_csrf">{{_csrf}}</script>
    <script id="js_templates" type="text/x-okdoki">      <div class="loading msg"></div>
      <div class="success msg"></div>
      <div class="errors msg"></div>
      <li class="screen_name"><a class="name" href="/me/{name}"></a></li>
    </script>
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
    <script src="/applets/Create_Life/script.js" type="text/javascript"></script>
    <script src="/applets/Bot_Create/script.js" type="text/javascript"></script>
    <script src="/Customer/lifes/script.js" type="text/javascript"></script>
  </body>
</html>
