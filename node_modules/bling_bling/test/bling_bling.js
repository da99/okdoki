
var assert = require("assert");
var BB     = require("../lib/b_b").Bling_Bling;
var txt    = "Last weekend I\n  visited the UFO.";

describe( 'Section:', function () {

  it( 'turns sections into h3', function () {
    var p = BB.new("Section: Hello");
    assert.equal(p.to_html(), "<h3>Hello</h3>");
  });

}); // === end desc

describe( 'Paragraphs/Blocks', function () {

  it( 'turns blocks of text into div.p', function () {
    var p = BB.new("\n" + txt + "\n");
    assert.equal(p.to_html(), "<div class=\"p\">" + txt + "</div>" );
  });

}); // === end desc

describe( 'italics', function () {

  it( 'generates italics from: /text/', function () {
    var p = BB.new("\nMy link: /txt/\n");
    assert.equal(p.to_html(), "<div class=\"p\">My link: <em>txt</em></div>" );
  });

  it( 'ignores invalid strongs: //text//', function () {
    var p = BB.new("\nMy link: //txt//\n");
    assert.equal(p.to_html(), "<div class=\"p\">My link: //txt//</div>" );
  });

}); // === end desc

describe( 'Strong', function () {

  it( 'generates strongs from: *text*', function () {
    var p = BB.new("\nMy link: *txt*\n");
    assert.equal(p.to_html(), "<div class=\"p\">My link: <strong>txt</strong></div>" );
  });

  it( 'ignores invalid strongs: **text**', function () {
    var p = BB.new("\nMy link: **txt**\n");
    assert.equal(p.to_html(), "<div class=\"p\">My link: **txt**</div>" );
  });

}); // === end desc

describe( 'Links', function () {

  it( 'generates links from: *text* [example.com]', function () {
    var p = BB.new("\nMy link: *txt* [example.com]\n");
    assert.equal(p.to_html(), "<div class=\"p\">My link: <a href=\"http://example.com/\">txt</a></div>" );
  });

  it( 'ignores invalid links: *text* [ex.//fdf]', function () {
    var p = BB.new("\nMy link: *txt* [http://example.com/ a/]\n");
    assert.equal(p.to_html(), "<div class=\"p\">My link: <strong>txt</strong> [http://example.com/ a/]</div>" );
  });

}); // === end desc

describe( 'Quote', function () {

  it( 'generates blockquotes: Quote: ....', function () {
    var p = BB.new("Quote:\nHello \nand\n goodbye.\nEnd Quote.");
    assert.equal(p.to_html(), "<blockquote>Hello \nand\n goodbye.</blockquote>");
  });

}); // === end desc

describe( 'Combinations', function () {

  it( 'generates: section, block', function () {
    var p = BB.new("Section: Greeting\n \n" + txt + "\n");
    assert.equal(p.to_html(), "<h3>Greeting</h3>\n<div class=\"p\">" + txt + "</div>" );
  });

  it( 'generates: section, block, block', function () {
    var p = BB.new("Section: Greeting\n \nHello\n \n" + txt);
    assert.equal(p.to_html(), [
                 "<h3>Greeting</h3>",
                 "<div class=\"p\">Hello</div>",
                 "<div class=\"p\">" + txt + "</div>"
    ].join("\n"));
  });

}); // === end desc




