
var is_dev   = ['127.0.0.1', 'localhost'].indexOf(window.location.hostname) > -1 && window.console && window.console.log;
var base_url = window.location.href.replace(/\/$/, '');
var App  = _.extend({}, Backbone.Events);

App.on('all', function (name) {
  log("event: " + name);
});

function csrf_token_val() {
  var csrf_token = $('#csrf_token').val()
  return csrf_token;
}

function log(msg) {
  if (is_dev)
    return console.log(msg);

  return null;
};

function func() {
  return _.partial.apply(_, arguments);
}

// ****************************************************************
// ****************** Forms ***************************************
// ****************************************************************

function submit(e) {
  var form = $(this).parents('form');
  var id = $(form).attr('id');
  App.trigger('submit:' + id, {id: id});
  return false;
}











