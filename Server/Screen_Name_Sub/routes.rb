
require './Server/Screen_Name_Sub/model'

# ============ CREATE ===============================================


post "/Sub" do
  var data = _.clone(req.body);
  mod.New_River(req, resp, next)
  .read_one('screen_name', function (j) {
    Screen_Name.read_by_screen_name(req.params.screen_name, req.user, j);
  })
  .create_one(function (j, sn) {
    Sub.create_by_screen_name(sn, data, j);
  })
  .job(function (j, model) {
    resp.json({
    success : true,
    msg     : 'Created: ',
    model   : model.to_client_side()
  });
  })
  .run();
end

post "/Screen_Name_Sub" do

  begin
    Screen_Name_Sub.create(params)
  rescue Screen_Name_Sub::Invalid =>e
    json false, e.msg
  end

end # === post /Screen_Name_Sub

# ============ READ =================================================

get "/Sub/:id" do
  var OK            = mod.New_Request(arguments);
  var opts          = OK.template_data('Sub/show_one');
  opts['title']     = "Sub #" + req.params.id;
  return OK.render_template();
end

get "/Screen_Name_Sub/:id" do

  begin
    Screen_Name_Sub.read(params)
  rescue Screen_Name_Sub::Not_Found =>e
    json false, e.msg
  end

end # === get /Screen_Name_Sub/:id






