
$(function () {

  $('textarea').focus( function () {
    var txt = $(this).val();
    if (txt === 'Type your question here.' || txt === 'Type your reason here.') {
      $(this).val('');
      $(this).removeClass('blurred');
    };
  });

  $('#control_priv').change(function () {
    var form     = $(this).closest('form');
    var textarea = form.find('div.specify');
    var submit   = form.find('button.submit');

    submit.show();

    if ($(this).val() === 'S')
      textarea.show();
    else
      textarea.hide();
  });

  Forms.Submit_Button('#form_homepage_priv button.submit', {
    before_submit : function (opts) {
      // var form     = $(this).closest('form');
      // var textarea = form.find('div.specify');
      // var submit   = form.find('button.submit');
      // var box      = $(this).closest("div.options");
    }, after_success: function () {
      $('#form_homepage_priv div.fields').show();
      $('#form_homepage_priv button.submit').hide();
    }
  });

  $('#show_form_create_content').click(function (e) {
    e.preventDefault();
    $(this).hide();
    $('#form_create_content').show();
  });

  Forms.Submit_Button('#form_trash_screen_name button.submit', {
    after_success: function () {
      $('#form_trash_screen_name').addClass('trashed');
    }
  });

  Forms.Undo_Button('#form_trash_screen_name button.undo', {
    after_success: function () {
      $('body').removeClass('trashed');
    }
  });

  Forms.Submit_able('#form_update_about');
  Forms.Submit_able('#form_create_question', {
    after_success: function (resp) {
      resp.rows[0].html_order = 'prepend';
      qa_record('row', resp.rows[0]);
    }
  });
  Forms.Submit_able('#form_create_cheer_or_jeer', {
    before_submit: function (o) {
      o.url = o.url.replace('/cheer', '/' + $('#form_create_cheer_or_jeer select[name="section_name"]').val());
    },
    after_success: function (resp) {
      resp.rows[0].html_order = 'prepend';
      boo_record('row', resp.rows[0]);
    }
  });

  var base_path = window.location.pathname.replace(/\/$/, '');
  Records.get(base_path + '/list/qa', '#qa', qa_record);
  Records.get(base_path + '/list/cheers-boos', '#boos', boo_record);
  Records.get(base_path + '/list/posts', '#latest', latest_record);

});

function qa_record(type, o) {
  var id = '#qa';
  switch (type) {
    case 'no_rows':
      Records.no_rows(id, o.msg);
    break;
    case 'row':
      var q = $('<div class="record"></div>');
      q.text(o.body);
      $(id + ' div.body  div.records')[o.html_order || 'prepend'](q);
    break;
    default:
      Records.error(id, o);
  };
};

function boo_record(type, o) {
  var id = '#boos';
  switch (type) {
    case 'no_rows':
      Records.no_rows(id, o.msg);
    break;
    case 'row':
      var q = $('<div class="record"></div>');
      q.text(o.body);
      $(id + ' div.body  div.records')[o.html_order || 'prepend'](q);
    break;
    default:
      Records.error(id, o);
  };
};

function latest_record(type, o) {
  var id = '#latest';
  switch (type) {
    case 'no_rows':
      Records.no_rows('#latest', o.msg);
      break;
    case 'row':
      var q = $('<div class="record"></div>');
    q.text(o.body);
    $(id + ' div.body div.records').append(q);
    break;
    default:
      Records.error(id, o);
  };
};

var Records = {};

Records.error = function (selector, o) {
  if (!o || !o.msg) {
    log("Uknown record missing error msg: ");
    log(o);
    return false;
  }

  var target = $(selector);
  var block  = target.children('div.body');
  var err    = $('<div class="error"></div>');
  err.text(o.msg);
  block.children('div.error').remove();
  block.prepend(err);

  return err;
};

Records.get = function (url, selector, callback) {
  var o = Records.default_ajax_options(url, selector, callback);
  return $.ajax(o);
};

Records.no_rows = function (selector, msg) {
  var div = $('<div class="no_rows"></div>');
  div.text(msg);
  var parent = $(selector + ' div.body');

  $(selector + ' div.no_rows').remove();
  $(selector + ' div.rows').remove();
  parent.prepend(div);
};

Records.default_ajax_options = function (url, selector, callback) {
  return { type : 'GET',
    url         : window.location.origin + url,
    cache       : false,
    dataType    : 'json',
    success     : function (resp, stat) {
      $(selector + ' div.body div.loading_rows ').remove();
      $(selector + ' div.body div.records ').remove();
      $(selector + ' div.body ').prepend($('<div class="records"></div>'));

      if (resp.success) {
        if (resp.rows.length == 0)
          callback('no_rows', resp, stat);
        else {
          var records = resp.rows.slice();
          while (records.length > 0) {
            callback('row', records.pop());
          };
        }
      } else {
        callback('fail', resp, stat );
      }
    },
    error : function (xhr, textStatus, errThrown) {
      var msg = textStatus + ' : ' + (errThrown || "Check internet connection. Either that or OKdoki.com is down.");
      callback('error', {msg: msg}, xhr, textStatus, errThrown);
    }
  }
};
