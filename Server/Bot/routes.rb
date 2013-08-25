
require './Server/Bot/model'

# ============ CREATE ===============================================

post '/Bot' do
  data = {sub_sn: req.body.sub_sn, as_this_life: req.body.as_this_life, user: req.user}
  begin
    b = Bot.create(data)
    json true, "Bot created: #{b.screen_name}", bot: b.to_public
  rescue Bot::Invalid => e
    json false, e.msg
  end
end # === post /Bot


# ============ READ =================================================

  app.get('/bot/:screen_name', function (req, resp, next) {

    var sn = req.params.screen_name;

    req.Ok.run(
      'read Bot by screen name', {screen_name: sn},
      resp.Ok.if_not_found("Bot not found: " + sn),
      'attach Bot_Code',
      function (f) {
        var bot = f.val.to_client_side();
        resp.Ok.render_template('Bot/bot', {
          bot      : bot,
          title    : bot.screen_name,
          Bot_Code : Bot_Code
        });
      }
    );

  }); // === end

  app.get('/bots/for/:screen_name', function (req, resp, next) {
    mod.New_River(req, resp, next)
    .job('read', function (j) {
      Bot.read_list_to_run(req.params.screen_name, j);
    })
    .run(function (fin, list) {
      return resp.json({
        success: true,
        msg: "List read.",
        bots: list
      });
    });
  });


get "/Bot/:id" do

  begin
    Bot.read(params)
  rescue Bot::Not_Found =>e
    json false, e.msg
  end

end # === get /Bot/:id



# ============ UPDATE ===============================================


  app.put('/Bot', function (req, resp, next) {
    mod.New_River(req, resp, next)
    .job('update', function (j) {
      Bot.update({
        sub_sn : req.body.sub_sn,
        owner  : req.body.as_this_life,
        code   : req.body.code
      }, j);
    })
    .run(function (j, last) {
      var bot = last.to_client_side();
      resp.json({success: true, msg: "Update successful.", bot: bot});
    });
  });

  app.put('/Bot/Code', function (req, resp, next) {
    F.run("update Bot Code", {aud: req.user, data: req.body}, function () {
      resp.json({success: false, msg: req.body.type});
    });
  });




