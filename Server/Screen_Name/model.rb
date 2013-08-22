
require './Server/Ok/model'
require 'Jam_Func'

class Screen_Name

  include Ok::Model
  extend Ok::Model_Extend

  # =====================================================
  # Errors
  # =====================================================

  class Dup < Ok::Invalid
  end

  class Invalid < Ok::Invalid
  end

  # =====================================================
  # Settings
  # =====================================================


  Jam = Jam_Func.new
  VALID_CHARS       = "a-zA-Z0-9\\-\\_\\."
  VALID             = /^[#{VALID_CHARS}]{4,15}$/i
  VALID_ENGLISH     = "Screen name must be: 4-15 valid chars: 0-9 a-z A-Z _ - ."
  INVALID           = /[^#{VALID_CHARS}]/
  Table_Name        = :screen_name
  TABLE             = DB[Table_Name]
  BANNED_SCREEN_NAMES = [
    /^MEGAUNI/i,
    /^MINIUNI/i,
    /^OKDOKI/i,
    /^(ME|MINE|MY|MI|i)$/i,
    /^PET-/i,
    /^BOT-/i,
    /^(ONLINE|CONTACT|INFO|OFFICIAL|ABOUT|NEWS|HOME)$/i,
    /^(UNDEFINED|DEF|SEX|SEXY|XXX|TED|LARRY)$/i,
    /^[.]+-COLA$/i
  ]

  # =====================================================
  # Helpers
  # =====================================================

  class << self

    def filter sn
      sn.gsub(INVALID, "")
    end

  end # === class self ==================================

  def to_url *args
    raw_sn = args.shift()
    sn = self.class.filter(raw_sn)
    return null if !sn.size

    args.unshift(sn)
    args.unshift('/me')
    args.join('/')
  end

  # =====================================================
  # Class
  # =====================================================


  # =====================================================
  # Instance
  # =====================================================

  def create raw_data
    # === Validate the data.
    @new_data = raw_data
    @clean_data = {}

    validate(:screen_name).
      clean('strip', 'upper').
      be('not empty').
      match(VALID, VALID_ENGLISH).
      not_match(BANNED_SCREEN_NAMES, 'Screen name not allowed.')

    validate(:type_id).
      clean('to_i').
      set_to(0, lambda { |v| v < 0 || v > 2 })

    insert_data = {
       :owner_id     => new_data[:customer] ? new_data[:customer].data.id : 0,
       :screen_name  => clean_data[:screen_name],
       :display_name => clean_data[:screen_name],
       :type_id      => (clean_data[:type_id] || 0)
    }

    begin
    new_record = TABLE.returning.insert(insert_data).first
    rescue Sequel::UniqueConstraintViolation => e
      raise e unless e.message['"screen_name_screen_name_key"']
      raise self.class::Invalid.new(self, "Screen name already taken: #{clean_data[:screen_name]}")
    end

    #, 'screen_name', 'Screen name alread taken: ' + insert_data[:screen_name])

    @data.merge! new_record
    return self if new_data[:customer]


    # // ==== This is a new customer
    # // ==== so we must use the screen name id
    # // ==== as the owner_id because customer record
    # // ==== has not been created.
    TABLE.where(:id=>self.data[:id]).update(:owner_id=>self.data[:id])

    self
  end # === def create

end # === Screen_Name ========================================




# // ================================================================
# // ================== Read ========================================
# // ================================================================

# S.prototype.is_world_read_able = function () {
  # return _.contains(this.data.read_able || [], WORLD);
# };

# S.read_by_id = function (id, flow) {
  # River.new(flow)
  # .job('read screen name id:', id, function (j) {
    # Topogo.new(TABLE_NAME).read_by_id(id, j);
  # })
  # .job(function (j, r) {
    # return j.finish(S.new(r));
  # })
  # .run();
# };

# EVE.on('read life by screen name', function (flow) {
  # var sn = flow.data.screen_name;
  # EVE.run(flow, function (j) {
    # Topogo.new(TABLE_NAME)
    # .read_one({screen_name: sn.toUpperCase()}, j);
  # }, function (j) {
    # j.finish(S.new(j.last));
  # });
# });


# S.find_screen_name_keys = function (arr) {
  # var key = _.detect([ 'screen_name_id', 'publisher_id', 'owner_id', 'author_id', 'follower_id'], function (k) {
    # return (arr[0] || '').hasOwnProperty(k);
  # }) || 'screen_name_id';

  # var new_key = key.gsub('_id', '_screen_name');
  # return [key, new_key];
# };

# S.attach_screen_names = function (arr, flow) {
  # var keys = S.find_screen_name_keys(arr);
  # var key = keys[0];
  # var new_key = keys[1];

  # var vals = _.pluck(arr, key);
  # if (!vals.length)
    # return flow.finish([]);

  # River.new(flow)
  # .job(function (j) {
    # TABLE.read_list({id: vals}, j);
  # })
  # .job(function (j, names) {
    # var map = {};
    # _.each(names, function (n) {
      # map[n.id] = n.screen_name;
    # });

    # _.each(arr, function (r, i) {
      # arr[i][new_key] = map[arr[i][key]];
    # });

    # j.finish(arr);
  # })
  # .run();
# };

# S.gsub_screen_names = function (arr, flow) {
  # var keys = S.find_screen_name_keys(arr);
  # var key = keys[0];
  # var new_key = keys[1];

  # River.new(flow)
  # .job(function (j) {
    # S.attach_screen_names(arr, j);
  # })
  # .job(function (j, new_arr) {
    # _.each(new_arr, function (r, i) {
      # new_arr[i][key] = undefined;
    # });

    # j.finish(new_arr);
  # })
  # .run();
# };

# S.read_list = function (c, flow) {
  # River.new()
  # .job('read screen names', c.data.id, function (j) {
    # Topogo.new(TABLE_NAME)
    # .read_list({owner_id: j.id}, j);
  # })
  # .job('push', 'screen_names', function (j, r) {
    # _.each(r, function (row) {
      # c.push_screen_name_row(row);
    # });
    # return j.finish(c);
  # })
  # .job(function (j, last) {
    # flow.finish(last);
  # })
  # .run();
# };

# S.prototype.read_screen_names = function (flow) {
  # var me = this;

  # River.new(arguments)

  # .job('read screen names for:', me.data.id, function (j) {
    # Topogo.new(TABLE_NAME).read_list({owner_id: j.id}, j);
  # })

  # .job(function (j, names) {
    # if (!names.length)
      # return flow.finish('not_valid', new Error('No screen names found for customer id: ' + me.data.id));

    # me.data.screen_name_rows = null;

    # _.each(names, function (v, k) {
      # me.push_screen_name_row(v);
    # });

    # return j.finish(me);
  # })

  # .run();

# };

# // ================================================================
# // =================== Update Validations =========================
# // ================================================================


# S.prototype.edit_homepage_title = function (val) {
  # var new_val = val.toString().trim();
  # if (new_val.length === 0)
    # new_val = null;
  # this.push_sanitized_data('homepage_title', new_val);
# };

# S.prototype.edit_about = function (val) {
  # var new_val = val.toString().trim();
  # if (new_val.length === 0)
    # new_val = null;
  # this.push_sanitized_data('about', new_val);
# };


# S.prototype.edit_homepage_allow = function (val) {
  # this.validator.check(val, "'allow' must be an array.").isArray();
  # this.push_sanitized_data('homepage_allow', val);
# };


# S.prototype.edit_screen_name = function (n) {

  # var old = this.new_data.old_screen_name;

  # if (old) // updating old name
    # this.push_sanitized_data('screen_name_id', this.screen_name_id(old));
  # else {
    # // inserting new name
  # }

  # this['new_screen_name'](n);
# };


# S.prototype.edit_read_able = function (v) {
  # switch (v) {
    # case 'W':
      # break;
    # case 'N':
      # break;
    # case 'S':
      # break;
    # default:
      # throw new Error('Unknown read_able value: ' + v);
  # };

  # this.push_sanitized_data('read_able', v);
# }

# S.prototype.edit_read_able_list = function (v) {
  # if (this.sanitized_data.read_able !== 'S')
    # return false;

  # if (!v)
    # throw new Error('read_able_list can\'t be false-y: ' + typeof(v));

  # var list = _.reject(v.trim().split(/[,\s]+/ig), function (str, i) {
    # return str === "";
  # });

  # if (list.length === 0)
    # this.push_sanitized_data.read_able = 'N';
  # else
    # this.push_sanitized_data('read_able_list', list);
# }

# S.prototype.edit_at_url = function (v) {
  # return edit_bot_url(this, 'at_url', v);
# };

# S.prototype.edit_at_pass_phrase = function (v) {
  # return edit_bot_pass_phrase(this, 'at_pass_phrase', v);
# };

# S.prototype.edit_bot_url = function (v) {
  # return edit_bot_url(this, 'bot_url', v);
# };

# S.prototype.edit_bot_pass_phrase = function (v) {
  # return edit_bot_pass_phrase(this, 'bot_pass_phrase', v);
# };


# // ================================================================
# // =================== Update =====================================
# // ================================================================

# var Validate_Update = Check.new('update screen name', function (vu) {

  # vu.define('screen_name', Validate_Create.validations['screen_name']);

  # vu.define('about', function (vador) {
    # vador
    # .is_null_if_empty()
    # ;
  # });

  # vu.define('type_id', Validate_Create);

  # vu.define('nick_name', function (vador) {
    # vador
    # .is_null_if_empty()
    # ;
  # });


# });

# S.update = function ( customer, flow ) {
  # var me = S.new({});
  # if (customer.new_data) {
    # me.new_data = customer.new_data;
  # } else {
    # if (customer.owner)  {
      # me.new_data = _.clone(customer);
      # customer = me.new_data.owner;
      # delete me.new_data.owner;
    # } else {
      # me.new_data = customer;
      # customer = customer.owner;
    # }
  # }

  # var row = customer.screen_name_row(me.new_data.old_screen_name || me.new_data.screen_name);

  # if (!Validate_Update.run(me))
    # return flow.invalid(me.errors);

  # var set = {}, final_data = {};

  # _.each('screen_name type_id about nick_name'.split(' '), function (key) {
    # if (!me.sanitized_data.hasOwnProperty(key))
      # return;

    # switch (key) {

      # case 'screen_name':
        # if (me.new_data.old_screen_name) {
        # set.screen_name = me.sanitized_data.screen_name;
        # set.display_name = me.sanitized_data.display_name;
        # final_data.old_screen_name = me.new_data.old_screen_name.toUpperCase();
      # }
      # break;

      # default:
        # set[key] = me.sanitized_data[key];

    # };
  # });

  # if(set.settings)
    # set.settings = JSON.stringify(set.settings);
  # if(set.details)
    # set.details  = JSON.stringify(set.details);

  # River.new(arguments)
  # .job('update screen name', me.data.screen_name, function (j) {
    # Topogo.new(TABLE_NAME).update_where_set(row.id, set, j)
  # })
  # .job(function (j, row) {
    # customer.push_screen_name_row(_.extend(set, row, final_data));
    # return j.finish(customer);
  # })
  # .run();

# };


# // ================================================================
# // =================== Trash/Delete ===============================
# // ================================================================

# S.untrash = function (id, flow) {
  # Topogo.new(TABLE_NAME)
  # .untrash(id, flow);
# };

# S.trash = function (id, flow) {
  # Topogo.new(TABLE_NAME)
  # .trash(id, flow);
# };

# S.delete_trashed = function (flow) {
  # Topogo.new(TABLE_NAME)
  # .delete_trashed(flow);
# };

# S.delete_by_owner_ids = function (arr, flow) {
  # var sql = "DELETE FROM \"" + TABLE_NAME + "\" WHERE owner_id IN ( " +
    # _.map(arr, function (n, i) { return "$" + (i + 1); }).join(', ') +
    # " ) RETURNING * ;";

  # Topogo
  # .run(sql, arr, flow);
# };





