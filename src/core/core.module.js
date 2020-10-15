"use strict";
function __export(m) {
  for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
const vsc = require("vscode");
const core = require("./core.module");
__export(require("./commands/CommandManager"));
__export(require("./commands/SignIn"));
__export(require("./commands/SignOut"));
__export(require("./providers/DocumentState"));
__export(require("./providers/LintingManager"));
__export(require("./services/CoreConfig"));
__export(require("./services/PsgServiceClient"));
__export(require("./services/ToolboxState"));
__export(require("./status-bar/SSOButton"));
__export(require("./status-bar/StatusBarManager"));
__export(require("./utils/RangeUtils"));
function activate(ctx) {
  exports.GlobalState = ctx.globalState;
  ctx.subscriptions.push(
    core.CommandManager.registerCommand(new core.SignInCommand()),
    core.CommandManager.registerCommand(new core.SignOutCommand())
  );
  core.StatusBarManager.registerStatusBarComponent(
    vsc.StatusBarAlignment.Right,
    0,
    new core.SSOButton()
  );
}
exports.activate = activate;
function deactivate() {
  core.DocumentState.clear();
}
exports.deactivate = deactivate;
