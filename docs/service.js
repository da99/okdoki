


function To_Service(obj) {
  obj.events = {};
  obj.on = To_Service.on;
  obj.copy_event_callbacks = To_Service.copy_event_callbacks;
  obj.run_event = To_Service.run_event;
  return obj;
}

To_Service.on = function (name, callback) {
  var e = this.events[name];
  if (!e)
    e = this.events[name] = [];
  e.push(callback);
  return this;
}

To_Service.copy_event_callbacks = function (name) {
  var e = this.events[name];
  if (!e)
    e = this.events[name] = [];
  return e.slice();
}

To_Service.next = function () {
  var c = this.event_callbacks.shift();
  if (c) {
    c(this.event_name, this);
    this.next();
  }
}

To_Service.add_callback = function (func) {
  this.event_callbacks.push(func);
  return this;
}

To_Service.run_event = function (name) {
  var msg = {
    event_name      : name,
    event_callbacks : this.copy_event_callbacks(name),
    add_callback    : To_Service.add_callback,
    next            : To_Service.next
  };

  msg.next();
  return this;
}



var Customer = To_Service({});

process.on('exit', function () {
  Customer.run_event('validate')
});

Customer.on('validate', function (name, obj) {
  obj.names = true;
});

Customer.on('validate', function (name, obj) {
  obj.email = true;
});

Customer.on('validate',function (name, obj) {
  console.log(obj);
});












