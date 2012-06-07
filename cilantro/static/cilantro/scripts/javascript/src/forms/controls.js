// Generated by CoffeeScript 1.3.3
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

define(['environ', 'mediator', 'jquery', 'underscore', 'backbone'], function(environ, mediator, $, _, Backbone) {
  var Control, NEGATION_OPERATORS, NumberControl, StringControl;
  NEGATION_OPERATORS = {};
  Control = (function(_super) {

    __extends(Control, _super);

    function Control() {
      return Control.__super__.constructor.apply(this, arguments);
    }

    Control.prototype.events = {
      'submit': 'preventDefault',
      'click [name=include]': 'submitInclude',
      'click [name=exclude]': 'submitExclude',
      'mouseenter': 'showControls',
      'mouseleave': 'hideControls',
      'change [name=operator]': 'toggleControls'
    };

    Control.prototype.initialize = function() {
      var _this = this;
      return mediator.subscribe("datafield/" + this.model.id + "/edit", function(node) {
        if (node === _this.node) {
          return;
        }
        _this.node = node;
        return _this.set();
      });
    };

    Control.prototype.setup = function() {
      var operator, text, _i, _len, _ref, _ref1, _results;
      _ref = this.model.get('operators');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        _ref1 = _ref[_i], operator = _ref1[0], text = _ref1[1];
        if (operator.charAt(0) === '-') {
          NEGATION_OPERATORS[operator.substr(1)] = operator;
          continue;
        }
        _results.push(this.$operator.append("<option value=" + operator + ">" + text + "</option>"));
      }
      return _results;
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

    Control.prototype.set = function() {
      var operator, value;
      value = this.node.get('value');
      operator = this.node.get('operator');
      if (/^-/.test(operator)) {
        operator = operator.substr(1);
      }
      this.setValue(value);
      return this.setOperator(operator);
    };

    Control.prototype.getValue = function(options) {
      return this.value.val();
    };

    Control.prototype.getOperator = function(options) {
      var operator;
      if (options.negated && NEGATION_OPERATORS[(operator = this.operator.val())]) {
        operator = NEGATION_OPERATORS[operator];
      }
      return operator;
    };

    Control.prototype.setValue = function(value) {
      return this.value.val(value);
    };

    Control.prototype.setOperator = function(value) {
      this.operator.val(value);
      return this.toggleControls();
    };

    Control.prototype.preventDefault = function(event) {
      return event.preventDefault();
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
      return this.$controls.fadeIn(300);
    };

    Control.prototype.hideControls = function(event) {
      return this.$controls.fadeOut(300);
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
                <label class=control-label>{{ label }}</label>\
                <div class=controls>\
                    <select class=span4 name=operator></select>\
                    <input class=span4 type=text name=value>\
                    <p class=help-block>{{ help }}</p>\
                </div>\
                <div class=form-actions>\
                    <button class="btn btn-mini btn-danger" name=exclude>Exclude</button>\
                    <button class="btn btn-mini btn-success" name=include>Include</button>\
                </div>\
            </div>\
        ');

    StringControl.prototype.initialize = function() {
      StringControl.__super__.initialize.apply(this, arguments);
      this.setElement(this.template({
        label: this.model.get('name'),
        help: this.model.get('description')
      }));
      this.$value = this.$('[name=value]');
      this.$operator = this.$('[name=operator]');
      this.$controls = this.$('.form-actions');
      return this.setup();
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
                <label class=control-label>{{ label }}</label>\
                <div class=controls>\
                    <select class=span4 name=operator></select>\
                    <input class=span4 type=number name=value>\
                    <input class=span4 type=number name=value-2>\
                    <span class=units>{{ units }}</span>\
                    <p class=help-block>{{ help }}</p>\
                </div>\
                <div class=form-actions>\
                    <button class="btn btn-mini btn-danger" name=exclude>Exclude</button>\
                    <button class="btn btn-mini btn-success" name=include>Include</button>\
                </div>\
            </div>\
        ');

    NumberControl.prototype.initialize = function() {
      NumberControl.__super__.initialize.apply(this, arguments);
      this.setElement(this.template({
        label: this.model.get('name'),
        units: this.model.get('units'),
        help: this.model.get('description')
      }));
      this.$value = this.$('[name=value]');
      this.$value2 = this.$('[name=value-2]');
      this.$operator = this.$('[name=operator]');
      this.$controls = this.$('.form-actions');
      return this.setup();
    };

    return NumberControl;

  })(Control);
  /*
      class ControlGroup extends Backbone.View
          template: _.template '
              <div class=control-group>
                  <label class=control-label>{{ label }}</label>
                  <div class=controls></div>
              </div>
          '
  
          initialize: (options) ->
              @setElement @template()
              @$label = @$el.find '.control-label'
              @$controls = @$el.find '.controls'
              @$helpBlock = @$el.find '.help-block'
              @hasField = false
  
          addField: (el) ->
              if @hasField
                  @$controls.find('input,select').after el
              else
                  @$controls.prepend el
                  @hasField = true
  */

  App.StringControl = StringControl;
  App.NumberControl = NumberControl;
  return {
    StringControl: StringControl,
    NumberControl: NumberControl
  };
});