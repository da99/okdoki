
$(function () {
  form( '#Creates form', function (f) {
    f.at_least_one_not_empty('input[name="title"]', 'textarea[name="body"]');

    f.on_success(function (result) {
      reset_forms(f);
      var last_id  = $('#Items div.item').last().attr('id');
      var pieces = last_id.split('_');
      var num_id = pieces.pop();
      var prefix = pieces.join('_');
      var new_id = prefix + '_' + parseInt(num_id);

      var data = {TITLE: result.record[0], BODY: result.record[1]};
      var new_e = (result.record[0]) ?
        compile_template('div.with_title', data) :
        compile_template('div.item', data);
      new_e.attr('id', new_id);
      $('div.items').append(new_e);
    });
  });
});
