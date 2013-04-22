
var is_dev     = ['127.0.0.1', 'localhost'].indexOf(window.location.hostname) > -1 && window.console && window.console.log;
var base_url   = window.location.href.replace(/\/$/, '');

function csrf_token_val() {
  var csrf_token = $('#csrf_token').val()
  return csrf_token;
}

function log(msg) {
  if (is_dev)
    return console.log(msg);

  return null;
};

// ****************************************************************
// ****************** Forms ***************************************
// ****************************************************************

function submit() {
  log('submitting: ' + $(this));
  return false;
}

function func() {
  return _.partial.apply(_, arguments);
}

var Msg_Bus = _.extend({}, Backbone.Events);










