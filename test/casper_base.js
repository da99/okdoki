function exists( s ) {
  return function () {
    return this.exists(s);
  };
};

function test() {
  var type = arguments[0];
  var args = [];
  var l = arguments.length;
  var i = 1;
  while (i < l) {
    args.push(arguments[i]);
    i++;
  };
  return function () {
    this.test[type].apply(this.test, args);
  };
};

exports.create_exists = exists;
exports.create_test   = test;

// http://roguejs.com/2011-11-30/console-colors-in-node-js/
var red_c, blue_c, reset;
red_c   = '\u001b[31m';
blue_c  = '\u001b[34m';
reset   = '\u001b[0m';

function red(msg) {
  return red_c + msg + reset;
}
exports.prepare = function (casper) {
  casper.on('error', function(msg, trace) {
    this.echo(red( + 'JS error: ' + msg));
    this.echo('Exiting...');
    this.exit(1);
  });

  casper.on('page.error', function(msg, trace) {
    this.echo(red( 'JS page error: ' + msg ));
    this.echo('Exiting...');
    this.exit(1);
  });

  casper.on('http.status.404', function(resource) {
    this.echo(red( 'wait, this url is 404: ' + resource.url));
    this.echo('Exiting...');
    this.exit(1);
  });

  casper.on('http.status.500', function(resource) {
    this.echo(red('woops, 500 error: ' + resource.url));
    this.echo('Exiting...');
    this.exit(1);
  });

  casper.on('http.status.501', function(resource) {
    this.echo(red( 'woops, 501 error: ' + resource.url));
    this.echo('Exiting...');
    this.exit(1);
  });

  casper.on('http.status.503', function(resource) {
    this.echo(red( 'woops, 503 error: ' + resource.url) );
    this.echo('Exiting...');
    this.exit(1);
  });

}
