"use strict";

var latest = null;
var latest_body = null;
$(function () {

  $('#forms a.sign_in').click(function (e) {
    e.preventDefault();
    $('#forms form').hide();
    $('#sign_in').show();
    $('#forms a').removeClass("selected");
    $(this).addClass("selected");
  });

  $('#forms a.create_account').click(function (e) {
    e.preventDefault();
    $('#forms form').hide();
    $('#create_account').show();
    $('#forms a').removeClass("selected");
    $(this).addClass("selected");
  });

  $('#forms a.cancel').click(function (e) {
    e.preventDefault();
    $('#forms form').hide();
    $('#forms a').removeClass("selected");
  });

  Forms.Submit_Button('#submit_form_create_screen_name', {
    after_success: function (o) {
      if (!o.screen_name)
        return false;

      var new_path = '/info/' + o.screen_name + '/';
      var new_loc = window.location.protocol + '//' + window.location.host + new_path;

      // Add screen name to list:
      var li = $('<li></li>');
      var a  = $('<a></a>');
      a.attr('href', new_path);
      li.append(a);
      $('#homepages div.body ul').append(li);
      document.location.href = new_loc;
    }
  });

  Forms.Submit_Button('#submit_form_sign_in', {
    after_success: function () {
      window.location.reload();
    }
  });

  Forms.Submit_Button('#submit_form_create_account', {
    after_success: function () {
      window.location.reload();
    }
  });

  latest = $('body.logged_in #latest');
  latest_body = latest.find('div.body');
  latest.each(function(i, ele) {
    $.ajax({
      type        : 'GET',
      url         : '/news-feed',
      cache       : true,
      accepts : 'application/json',
      contents : 'application/json',
      // data        : JSON.stringify({}),
      dataType    : 'json',
      success     : function (resp, stat) {
        return print_news_feed(resp);
      },
      error       : function (xhr, textStatus, errThrown) {
        return print_news_feed({success: false, msg: textStatus});
      }
    });
  });

}); // $(function)

function print_news_feed(o) {
  latest.find('div.no_news').remove();
  latest.find('div.please_wait').remove();
  latest.removeClass('loading');

  if (!o.success)
    return print_news_feed_item({body: 'News feed is unavailable. Try later.'});

  if (o.items && o.items.length === 0)
    return print_news_feed_item({body: 'No news yet.'});

  $.each(o.items, function (i, item) {
    print_news_feed_item(item);
  });
}

function print_news_feed_item(o) {
  if (!o.id) {
    var item = $('<div class="item no_news"></div>');
    item.text(o.body);
    latest_body.append(item);
    return true;
  }

  var item = $('<div class="item"></div>');
  var time = $('<span class="time"></span>');
  time.text(o.created_at);
  var val  = $('<span class="value"></span>');
  val.text(o.body);
  var read_more = $('<a class="read_more"></a>');
  read_more.attr('href', '/link/' + o.id)
  var label = $('<span class="label"></span>');
  label.text(' . . . ');
  var by = $('<span class="by"></span>');
  by.text(' by ');
  // var author = $('<a class="author"></a>');
  // author.attr('href', '/info/' + o.author);
  // author.text('@' + o.author);

  item.prepend(time);
  item.prepend(val);
  item.prepend(read_more);
  item.prepend(label);
  item.prepend(by);
  // item.prepend(author);

  latest_body.append(item);

  return item;
}

        // div.item.news
          // span.time 15 mins ago...
          // span.value  SOmething Really Bad Happend
          // a.read_more(href='/link/1') Link to this...
          // | &nbsp;
          // span.label News
          // span.by      by
          // a.author(href='/info/okdoki') @okdoki


        // div.item.news
          // span.time 15 mins ago...
          // span.value  SOmething Really Bad Happend
          // a.read_more(href='/link/1') Link to this...
          // | &nbsp;
          // span.label News
          // span.by      by
          // a.author(href='/info/okdoki') @okdoki

        // div.item.random
          // span.time 12 hours ago...
          // span.value  I just got demoted.
          // a.read_more(href='/link/1') Link to this...
          // | &nbsp;
          // span.label Random Thought
          // span.by      by
          // a.author(href='/info/okdoki') @okdoki

        // div.item.magazine
          // span.time 1 day ago...
          // span.value  My boss is in a bad mood.
          // a.read_more(href='/link/1') Link to this...
          // | &nbsp;
          // span.label Article
          // span.by      by
          // a.author(href='/info/okdoki') @okdoki

        // div.item.joke
          // span.time 2 days ago...
          // span.value  My kids are wieners.
          // a.read_more(href='/link/1') Link to this...
          // | &nbsp;
          // span.label Joke
          // span.by      by
          // a.author(href='/info/okdoki') @okdoki

        // div.item.important
          // span.time 5 days ago...
          // span.value  My spouse is trying to kill me.
          // a.read_more(href='/link/1') Link to this...
          // | &nbsp;
          // span.label Important News
          // span.by      by
          // a.author(href='/info/okdoki') @okdoki



$(function () {
  var i = 0;
  Sammy('span.or', function () {
    this.get('/', function () {
      this.$element().html('Hiya buddy: '  + (++i));
    });
    this.get('#/lifes', function () {
      this.$element().html('Hiya buddy, again: '  + (++i));
    });
  }).run();
});
