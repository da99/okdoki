
function log(msg) {
  if (window.location.hostname === 'localhost' && window.console && window.console.log) {
    console.log(msg);
  };
};
