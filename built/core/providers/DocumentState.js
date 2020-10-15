"use strict";
var vsc = require("vscode");
var core = require("../core.module");
var STATE_CONTAINER = "stateContainer";
var DocumentState = /** @class */ (function () {
  function DocumentState() {}
  DocumentState.clear = function () {
    core.GlobalState.update(STATE_CONTAINER, new StateContainer());
  };
  DocumentState.get = function (uri, module, defaultValue) {
    var container = core.GlobalState.get(STATE_CONTAINER, new StateContainer());
    var state = container.states.find(function (value, index, obj) {
      return value.module === module && value.uri === uri.toString();
    });
    if (state) {
      return state.data;
    } else {
      return defaultValue;
    }
  };
  DocumentState.onChange = function (callback) {
    if (!this._onChangeHandlers) {
      this._onChangeHandlers = new Array();
    }
    this._onChangeHandlers.push(callback);
  };
  DocumentState.update = function (uri, module, data) {
    var _this = this;
    var container = core.GlobalState.get(STATE_CONTAINER, new StateContainer());
    var state = container.states.find(function (value, index, obj) {
      return value.module === module && value.uri === uri.toString();
    });
    if (state) {
      state.data = data;
    } else {
      state = new State(data, module, uri.toString());
      container.states.push(state);
    }
    core.GlobalState.update(STATE_CONTAINER, container);
    container.states.forEach(function (state) {
      _this._onChangeHandlers.forEach(function (handler) {
        try {
          handler(state.data, state.module, vsc.Uri.parse(state.uri));
        } catch (error) {}
      });
    });
  };
  return DocumentState;
})();
exports.DocumentState = DocumentState;
var StateContainer = /** @class */ (function () {
  function StateContainer() {
    this.states = new Array();
  }
  return StateContainer;
})();
var State = /** @class */ (function () {
  function State(data, module, uri) {
    this.data = data;
    this.module = module;
    this.uri = uri;
  }
  return State;
})();
