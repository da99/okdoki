
$(function () {
  $("#sidebar div.options input[type='checkbox']").change(function () {
    var box = $(this).closest("div.options");
    box.addClass('loading');
    setTimeout(function () {
      box.removeClass('loading');
    }, 500);
  });

  $("#sidebar button").click(function (e) {
    e.preventDefault();
    var box = $(this).closest("div.options");
    box.addClass('loading');
    setTimeout(function () {
      box.removeClass('loading');
    }, 500);
  });

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
      $('body').addClass('trashed');
    }
  });

  Forms.Submit_Button('#form_trash_screen_name button.unsubmit', {
    before_submit: function (o) {
      o.url = o.url.replace("/trash", "/undo/trash");
      return o;
    },
    after_success: function () {
      $('body').removeClass('trashed');
    }
  });

  Forms.Submit_able('#form_update_about');
});
