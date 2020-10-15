"use strict";
var core = require("./core/core.module");
var x12 = require("./x12/x12.module");
function activate(ctx) {
  core.activate(ctx);
  x12.activate(ctx);
}
exports.activate = activate;
function deactivate() {
  core.deactivate();
  x12.deactivate();
}
exports.deactivate = deactivate;
