"use strict";
const vsc = require("vscode");
const core = require("../core.module");
const STATE_CONTAINER = "stateContainer";
class DocumentState {
  static clear() {
    core.GlobalState.update(STATE_CONTAINER, new StateContainer());
  }
  static get(uri, module, defaultValue) {
    let container = core.GlobalState.get(STATE_CONTAINER, new StateContainer());
    let state = container.states.find((value, index, obj) => {
      return value.module === module && value.uri === uri.toString();
    });
    if (state) {
      return state.data;
    } else {
      return defaultValue;
    }
  }
  static onChange(callback) {
    if (!this._onChangeHandlers) {
      this._onChangeHandlers = new Array();
    }
    this._onChangeHandlers.push(callback);
  }
  static update(uri, module, data) {
    let container = core.GlobalState.get(STATE_CONTAINER, new StateContainer());
    let state = container.states.find((value, index, obj) => {
      return value.module === module && value.uri === uri.toString();
    });
    if (state) {
      state.data = data;
    } else {
      state = new State(data, module, uri.toString());
      container.states.push(state);
    }
    core.GlobalState.update(STATE_CONTAINER, container);
    container.states.forEach((state) => {
      this._onChangeHandlers.forEach((handler) => {
        try {
          handler(state.data, state.module, vsc.Uri.parse(state.uri));
        } catch (error) {}
      });
    });
  }
}
exports.DocumentState = DocumentState;
class StateContainer {
  constructor() {
    this.states = new Array();
  }
}
class State {
  constructor(data, module, uri) {
    this.data = data;
    this.module = module;
    this.uri = uri;
  }
}
