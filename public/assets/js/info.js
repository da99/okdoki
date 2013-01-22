
$(function () {
  $("#sidebar div.options input[type='checkbox']").change(function () {
    var box = $(this).closest("div.options");
    box.addClass('loading');
    setTimeout(function () {
      box.removeClass('loading');
    }, 500);
  });

  $("#sidebar button").click(function () {
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
    var textarea = $('#form_homepage_priv div.specify');
    if ($(this).val() === 'specify') {
      textarea.show();
    } else {
      textarea.hide();
      var box = $(this).closest("div.options");
      box.addClass('loading');
      setTimeout(function () {
        box.removeClass('loading');
      }, 500);
    };
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
});
