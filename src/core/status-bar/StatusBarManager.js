"use strict";
const vsc = require("vscode");
class StatusBarManager {
  static registerStatusBarComponent(alignment, priority, component) {
    let item = vsc.window.createStatusBarItem(alignment, priority);
    component.activate(item);
  }
}
exports.StatusBarManager = StatusBarManager;
