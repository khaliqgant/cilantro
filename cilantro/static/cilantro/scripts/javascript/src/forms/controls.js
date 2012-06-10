// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['environ', 'mediator', 'jquery', 'underscore', 'backbone'], function(environ, mediator, $, _, Backbone) {
  var Control, DEFAULT_EVENTS, EnumerableControl, NEGATION_OPERATORS, NumberControl, StringControl, formActionsTemplate;
  formActionsTemplate = _.template('\
        <div class=form-actions>\
            <button class="btn btn-mini btn-danger" name=exclude title="Exclude the results that match">Exclude</button>\
            <button class="btn btn-mini btn-success" name=include title="Include the results that match">Include</button>\
        </div>\
    ');
  NEGATION_OPERATORS = {};
  DEFAULT_EVENTS = {
    'submit': 'preventDefault',
    'click [name=include]': 'submitInclude',
    'click [name=exclude]': 'submitExclude',
    'mouseenter': 'showControls',
    'mouseleave': 'hideControls',
    'change [name=operator]': 'toggleControls'
  };
  Control = (function(_super) {

    __extends(Control, _super);

    function Control() {
      return Control.__super__.constructor.apply(this, arguments);
    }

    Control.prototype.events = DEFAULT_EVENTS;

    Control.prototype.initialize = function(options) {
      var _this = this;
      this.options = options;
      mediator.subscribe("datafield/" + this.model.id + "/edit", function(node) {
        if (node === _this.node) {
          return;
        }
        return _this.set(node);
      });
      return this.setup();
    };

    Control.prototype.setup = function() {
      var operator, operators, text, _i, _len, _ref, _ref1;
      this.$label = this.$('.control-label');
      if (this.options.label === false) {
        this.$label.hide();
      }
      this.$value = this.$('[name=value]');
      this.$operator = this.$('[name=operator]');
      this.$controls = this.$('.form-actions');
      _ref = (operators = this.model.get('operators'));
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], operator = _ref1[0], text = _ref1[1];
        if (operator.charAt(0) === '-') {
          NEGATION_OPERATORS[operator.substr(1)] = operator;
          continue;
        }
        this.$operator.append("<option value=" + operator + ">" + text + "</option>");
      }
      if (this.$operator.children().length === 1) {
        this.$operator.hide();
      }
      this.$el.append(formActionsTemplate());
      this.$include = this.$('[name=include]');
      return this.$exclude = this.$('[name=exclude]');
    };

    Control.prototype.get = function(options) {
      var id, operator, value;
      id = this.node.id;
      operator = this.getOperator(options);
      value = this.getValue(options);
      return {
        id: id,
        operator: operator,
        value: value
      };
    };

    Control.prototype.set = function(node) {
      var operator, value;
      this.node = node;
      value = this.node.get('value');
      operator = this.node.get('operator');
      if (/^-/.test(operator)) {
        operator = operator.substr(1);
      }
      this.setValue(value);
      return this.setOperator(operator);
    };

    Control.prototype.preventDefault = function(event) {
      return event.preventDefault();
    };

    Control.prototype.getValue = function(options) {
      return this.$value.val();
    };

    Control.prototype.getOperator = function(options) {
      var operator;
      if (options == null) {
        options = {};
      }
      operator = this.$operator.val();
      if (options.negated && NEGATION_OPERATORS[operator]) {
        operator = NEGATION_OPERATORS[operator];
      }
      return operator;
    };

    Control.prototype.setValue = function(value) {
      return this.$value.val(value);
    };

    Control.prototype.setOperator = function(value) {
      this.$operator.val(value);
      return this.toggleControls();
    };

    Control.prototype.submitInclude = function(event) {
      event.preventDefault();
      return this.node.set(this.get());
    };

    Control.prototype.submitExclude = function(event) {
      event.preventDefault();
      return this.node.set(this.get({
        negated: true
      }));
    };

    Control.prototype.showControls = function(event) {
      return this.$controls.fadeTo(200, 1);
    };

    Control.prototype.hideControls = function(event) {
      return this.$controls.fadeTo(400, 0.3);
    };

    Control.prototype.toggleControls = function(event) {
      if (NEGATION_OPERATORS[this.$operator.val()]) {
        return this.$exclude.prop('disabled', false);
      } else {
        return this.$exclude.prop('disabled', true);
      }
    };

    return Control;

  })(Backbone.View);
  StringControl = (function(_super) {

    __extends(StringControl, _super);

    function StringControl() {
      return StringControl.__super__.constructor.apply(this, arguments);
    }

    StringControl.prototype.template = _.template('\
            <div class=control-group>\
                <h4 class=control-label>{{ label }}</h4>\
                <div class=controls>\
                    <select class=span4 name=operator></select>\
                    <input class=span4 type=text name=value>\
                    <p class=help-block>{{ help }}</p>\
                </div>\
            </div>\
        ');

    StringControl.prototype.initialize = function() {
      this.setElement(this.template({
        label: this.model.get('alt_name') || this.model.get('name'),
        help: this.model.get('description')
      }));
      return StringControl.__super__.initialize.apply(this, arguments);
    };

    return StringControl;

  })(Control);
  NumberControl = (function(_super) {

    __extends(NumberControl, _super);

    function NumberControl() {
      return NumberControl.__super__.constructor.apply(this, arguments);
    }

    NumberControl.prototype.template = _.template('\
            <div class=control-group>\
                <h4 class=control-label>{{ label }} <small class=units>({{ units }})</small></h4>\
                <div class=controls>\
                    <select class=span4 name=operator></select>\
                    <input class=span4 type=number name=value>\
                    <input class=span4 type=number name=value-2>\
                    <p class=help-block>{{ help }}</p>\
                </div>\
            </div>\
        ');

    NumberControl.prototype.events = _.extend({}, DEFAULT_EVENTS, {
      'change [name=operator]': 'toggleOperator'
    });

    NumberControl.prototype.initialize = function() {
      var units;
      this.setElement(this.template({
        label: this.model.get('alt_name') || this.model.get('name'),
        units: (units = this.model.get('data').plural_unit),
        help: this.model.get('description')
      }));
      if (!units) {
        this.$('.units').hide();
      }
      return NumberControl.__super__.initialize.apply(this, arguments);
    };

    NumberControl.prototype.setup = function() {
      NumberControl.__super__.setup.apply(this, arguments);
      return this.$value2 = this.$('[name=value-2]').hide();
    };

    NumberControl.prototype.getValue = function() {
      if (/range/.test(this.getOperator())) {
        return [this.$value.val(), this.$value2.val()];
      } else {
        return this.$value.val();
      }
    };

    NumberControl.prototype.setValue = function() {
      var value;
      value = this.node.get('value');
      if (/range/.test(this.node.get('operator'))) {
        this.$value.val(value[0]);
        return this.$value2.val(value[1]);
      } else {
        return this.$value.val(value);
      }
    };

    NumberControl.prototype.toggleOperator = function() {
      if (/range/.test(this.getOperator())) {
        return this.$value2.show();
      } else {
        return this.$value2.hide();
      }
    };

    return NumberControl;

  })(Control);
  EnumerableControl = (function(_super) {

    __extends(EnumerableControl, _super);

    function EnumerableControl() {
      return EnumerableControl.__super__.constructor.apply(this, arguments);
    }

    EnumerableControl.prototype.template = _.template('\
            <div class=control-group>\
                <h4 class=control-label>{{ label }}</h4>\
                <div class=controls>\
                    <select class=span4 name=operator></select>\
                    <select class=span8 name=value multiple></select>\
                    <p class=help-block>{{ help }}</p>\
                </div>\
            </div>\
        ');

    EnumerableControl.prototype.initialize = function() {
      this.setElement(this.template({
        label: this.model.get('alt_name') || this.model.get('name'),
        help: this.model.get('description')
      }));
      return EnumerableControl.__super__.initialize.apply(this, arguments);
    };

    EnumerableControl.prototype.setup = function() {
      EnumerableControl.__super__.setup.apply(this, arguments);
      return this.loadValues();
    };

    EnumerableControl.prototype.loadValues = function() {
      var _this = this;
      this.$el.addClass('loading');
      return Backbone.ajax({
        url: environ.absolutePath(this.model.get('links').values.href),
        success: function(resp) {
          var obj, _i, _len;
          for (_i = 0, _len = resp.length; _i < _len; _i++) {
            obj = resp[_i];
            _this.$value.append("<option value=" + obj.value + ">" + obj.name + " (" + obj.count + ")</option>");
          }
          return _this.$el.removeClass('loading');
        }
      });
    };

    return EnumerableControl;

  })(Control);
  App.StringControl = StringControl;
  App.NumberControl = NumberControl;
  App.EnumerableControl = EnumerableControl;
  return {
    StringControl: StringControl,
    NumberControl: NumberControl,
    EnumerableControl: EnumerableControl
  };
});
