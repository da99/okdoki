

    it( 'updates homepage about', function (done) {
      var expected = 'This is about: mem1new';
      Screen_Name.update('mem1new', {new_data: {"about": expected}}, function (row) {
        assert.equal(row.about, expected);
        done();
      });
    });

    it.skip( 'updates homepage title', function (done) {
      var expected = 'This is for: ' + screen_name_2;
      customer.update_screen_name(screen_name_2, {"homepage_title": expected}, function (meta) {
        customer.read_homepage(screen_name_2,  function (data) {
          assert.equal(data.details.title, expected);
          done();
        });
      });
    });

    it( 'updates homepage allow', function (done) {
      customer.read_screen_names(function (new_c) {
        var expected = _.pluck(new_c.data.screen_name_rows, 'id').sort();
        customer.update_screen_name(screen_name, {'homepage_allow': expected}, function (mets) {
          customer.read_homepage(screen_name, function (data) {
            assert.deepEqual(data.settings.allow.sort(), expected);
            done();
          });
        });
      });
    });
