
var Contacts = function (selector) {
  this.home       = $(selector);
  this.list       = this.home.find('div.contacts');
  this.loading    = this.home.find('div.loading');
  this.no_records = this.home.find('div.no_records');
}

Contacts.new = function (selector) {
  return (new Contacts(selector));
};

Contacts.prototype.read = function () {
  var o = {
    type        : 'POST',
    url         : base_url + "/contacts/online",
    cache       : false,
    contentType : 'application/json',
    data        : JSON.stringify({"_csrf": $('#csrf_token').val()}),
    dataType    : 'json',
    success     : function (resp, stat) {
      log(resp, stat);

      if (is_dev) {
        resp.menu = ({
          zebra       : ['go99'],
          mike_rogers : ['go99'],
          okdoki      : ['dos'],
          jeff_tucker : ['go99', 'dos'],
          Lew_Rock    : ['go99']
        });
      }


      The_Contacts.load(resp.menu || {});
    },
    error       : function (xhr, textStatus, errThrown) {
      log(textStatus, errThrown);
    }
  };

  $.ajax(o);
}

Contacts.prototype.first_load = function (menu) {
  return me.load(menu);
};

Contacts.prototype.load = function (menu) {
  var me   = this;

  if ($.isEmptyObject(menu)) {

    if (me.home.find('div.contact:first').length === 0)
      me.no_records.show();
  } else {

    $.each(menu, function (key, arr) {
      var ele  = $('<div class="contact">' +
                   '<div class="screen_name"></div>' +
                   '<div class="as">' +
                   '<span class="intro">As:</span>' +
                   '<span class="screen_names"></span>' +
                   '</div>' +
                   '</div>');

      var link = new_target( $('<a></a>').text(key).attr('href', "/info/" + key) );
      ele.find('div.screen_name').append(link);
      ele.find('span.screen_names').text(arr.join(', '));
      me.list.append(ele);
    });

    me.no_records.hide();
  }

  me.loading.hide();
  return me.list;
};

Contacts.prototype.sort = function () {
  chatters = _.uniq(chatters).sort();
  $("#contacts_list").empty();

  $.each(chatters.sort(), function (i, val) {
    $('#' + add_contact(val)).addClass('chatty');
  });
};


