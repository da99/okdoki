var e = require("escape_escape_escape").Sanitize;
var _ = require("underscore")._;

var SINGLES          = ['Section'];
var SINGLES_REGEXP   = new RegExp('(' + SINGLES.join('|') + '): (.+)', 'i');
var MULTI            = ['Quote', 'Code'];
var MULTI_REGEXP     = new RegExp('(' + MULTI.join('|') + '):', 'i');
var END_MULTI_REGEXP = new RegExp('END (' + MULTI.join('|') + ').', 'i');

function Is_Single(l) {
  return l.match(SINGLES_REGEXP);
}

function Is_Multi(l) {
  return l.match(MULTI_REGEXP);
}

function Is_Multi_End(l) {
  return l.match(END_MULTI_REGEXP);
}

function Pop_Until_Mutli_End(desc, lines) {
  return "";
}

function Pop_Block(target, lines) {
  return "";
}

var To_Blocks = function (str) {
  var lines          =  str.split("\n");
  var working        = lines.splice();
  var blocks         = {list: [], last_type: null};
  var blocks_i       = [];
  var special_blocks = [];

  var push_to_block = function (l) {
    if (blocks.last_type === 'multi block') {
      push_multi(l);
      return;
    }

    if (blocks.last_type !== 'block') {
      blocks.list.push([]);
      blocks_i.push(blocks.list.length - 1);
    }

    blocks.list[blocks.list.length - 1] = _.last(blocks.list) + "\n" + l;
    blocks.last_type = 'block';
    return blocks;
  };

  var push_single = function (l) {
    blocks.last_type = 'single';
    blocks.list.push(l);
    return 'single';
  };

  var push_multi = function (l) {
    blocks.list[blocks.list.length - 1] = _.last(blocks.list) + "\n" + l;
  };

  var start_multi = function (n) {
    blocks.last_type = 'multi block';
    special_blocks.push([blocks.list.length, n]);
    blocks.list.push([]);
    return n;
  };

  var end_multi = function () {
    blocks.last_type = null;
    return null;
  };

  _.each(lines, function (l) {
    working.pop();
    var trim      = l.trim();
    var is_empty  = trim.length === 0;

    if (!blocks.last_type && is_empty) {
      return;
    }

    if (blocks.last_type === 'block') {
      if (is_empty) {
        blocks.last_type = null;
        return;
      }
    }

    var is_single = Is_Single(trim);
    if (is_single) {
      if (is_single[1].toUpperCase() === 'SECTION') {
        push_single("<h3>" + is_single[2] + "</h3>");
      } else {
        push_to_block(is_single[0]);
      }
      return;
    }

    var is_multi = Is_Multi(trim);
    if (is_multi) {
      start_multi(is_multi[1].toLowerCase());
      return;
    }

    if (blocks.last_type === 'multi block') {
      if (Is_Multi_End(trim))
        return end_multi();
    }

    push_to_block(l);
  });

  _.each(blocks_i, function (i) {
    blocks.list[i] = '<div class="p">' + Block_To_HTML( (blocks.list[i]).trim() ) + "</div>";
  });

  _.each(special_blocks, function (pair) {
    var i = pair[0];
    var t = pair[1];
    if (t === 'quote') {
      t = 'blockquote';
      blocks.list[i] = blocks.list[i].trim();
    }
    blocks.list[i] = "<" + t + '>' + blocks.list[i] + '</' + t + '>';
  });

  return blocks;
};

var Block_To_HTML = function (l) {

  l = l.replace( /([\s]|^)\*(.+)\*\s+\[(.+)\]([\s]|$)/ig, function (full, a, content, uri, b) {
    if (uri.indexOf('://') < 0)
      uri = "http://" + uri;
    uri = e.uri(uri);
    if (uri.message)
      return full;

    return a + '<a href="HREF">TEXT</a>'
    .replace('HREF', uri)
    .replace('TEXT', content) + b;
  });

  l = l.replace(/([\s]|^)([\*\/])([^\*\/]+)([\*\/])([\s\W]|$)/ig, function (full, a, start, content, end, b) {
    if (start !== end)
      return full;
    if (start === '/')
      return a + "<em>" + content + "</em>" + b;
    if (start === '*')
      return a + "<strong>" + content + "</strong>" + b;
    return full;
  });

  return l;
};

var BB = exports.Bling_Bling = function () {
};

BB.new = function (str) {
  var o = new BB;
  o.original = e.html( str.replace(/\r\n/g, "\n") );
  o.lines = To_Blocks(o.original).list;
  return o;
};

BB.prototype.to_html = function () {
  var my = this;
  return my.lines.join("\n");
};
