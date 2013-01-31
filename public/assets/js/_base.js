
var is_dev = ['127.0.0.1', 'localhost'].indexOf(window.location.hostname) > -1 && window.console && window.console.log;

function log(msg) {
  if (is_dev)
    return console.log(msg);

  return null;
};
