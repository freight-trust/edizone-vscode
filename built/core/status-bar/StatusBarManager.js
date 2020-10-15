"use strict";
var vsc = require("vscode");
var StatusBarManager = /** @class */ (function () {
  function StatusBarManager() {}
  StatusBarManager.registerStatusBarComponent = function (
    alignment,
    priority,
    component
  ) {
    var item = vsc.window.createStatusBarItem(alignment, priority);
    component.activate(item);
  };
  return StatusBarManager;
})();
exports.StatusBarManager = StatusBarManager;
