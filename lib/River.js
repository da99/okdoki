var _ = require('underscore')
;

var River = exports.River = function (group, id, f) {
  this.style_name = 'whatever';
  this.job_list   = [];
  this.input_list = [];
  this.waits      = [];
  this.events     = { finish: [] };
  this.results    = [];

  this.group = group || "no group name";
  this.id = id || ++River.uniq_id;
  if (arguments.length > 2) {
    throw new Error('Unknown arguments: ' + _.toArray(arguments).slice(2));
  }
}

River.uniq_id = 0;

River.new = function (group, id) {
  var j = new River(group, id);
  return j;
};

River.prototype.job = function () {

  var me = this;

  if (arguments.length === 3) {
    me.job_list.push({
      group : arguments[0],
      id    : arguments[1],
      func  : arguments[2],
      parent: me
    });
  } else {
    var job = arguments[0];
    me.job_list.push({
      group: job.group,
      id: job.id,
      job: job,
      parent: me
    });
  }

  return me;
};

River.prototype.style = function (name) {
  this.style_name = name;
  return this;
};

River.prototype.on = function (name, f) {
  switch (name) {
    case 'finish':
      break;
    default:
      throw new Error('Unknown event:' + name);
  };
  var events = this.events[name];
  if (!events) {
    events = this.events[name] = [];
  }

  events.push(f);
  return this;
};

River.prototype.emit = function (name) {
  var e = this.events[name] || [];
  var me = this, i = 0, l = e.length;

  if ( l === 0 )
    return null;

  while( i < l ) {
    e[i](me);
    ++i;
  }

  return true;
};

River.prototype.finish = function () {

  if (this.is_finish) {
    throw new Error('Job already finished: ' +
                    this.group + ':' + this.id);
  }

  var err = arguments[0];
  var replys = _.toArray(arguments).slice(1);
  if (err) {
    throw err;
  }

  this.waits.shift();

  if (this.results) {
    this.results.push(replys);
  }

  if (this.after_each_finish) {
    this.emit('job finish');
  }

  if (this.waits.length < 1) {
    this.is_finish = true;
    this.emit('finish');
  } else if (this.style_name === 'line') {
    ++this.current_job;
    this.run_job(this.current_job);
  }

  return this;
};

River.prototype.run_job = function (i) {
  var me = this;
  var current_job = this.job_list[i];

  if (current_job.func)
    current_job.func(current_job);
  else
    current_job.job.run(current_job);
};

River.prototype.run = function () {
  var l = this.job_list.length;
  var i = 0;
  var target, method_name;
  var me = this;

  if ( l === 0 ) {
  } else {
    while (i < l) {
      this.waits.push(i);
      ++i;
    }

    i = 0;

    while (i < l) {
      me.run_job(i);
      if (me.style_name === 'line') {
        this.current_job = i;
        break;
      }
      ++i;
    }
  }

  return this;
};

River.prototype.for_each_finish = function (f) {
  this.after_each_finish = f;
  return this;
};
River.prototype.run_and_on_finish = function (f) {
  this.on('finish', f);
  this.run();
  return this;
};


if (false) {
function Customer () {};
Customer.create = function (j) {
  j.finish();
};

function Chat_Bot () {};
Chat_Bot.create = function (j) {
  j.finish();
};



  var J = River.new();
  var p = 'pass';

  _.each( ['GO99', 'DOS'], function (v) {
    J.job('create customer', v, function (j) {
      Customer.create({screen_name: j.input, pass_phrase: p}, j);
    });
  });

  _.each([['404@bot', 'https://1.com'], ['im@bot',  'https://2.com']], function (v) {
    J.job('create bot', v[0], function (j) {
      Chat_Bot.create({screen_name: j.input, url: v[1]}, j);
    });
  });

  J
  .style('waterfall')
  .for_each_finish(function (j) {
    log(j.waits);
  })
  .run();

}




