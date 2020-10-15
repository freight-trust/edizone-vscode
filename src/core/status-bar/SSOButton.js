"use strict";
const core = require("../core.module");
class SSOButton {
  constructor() {
    this._baseItem = null;
  }
  activate(baseItem) {
    this._baseItem = baseItem;
    this._baseItem.text = core.ToolboxState.ssoSignedIn
      ? "$(sign-out) Sign Out"
      : "$(sign-in) TC Sign In";
    this._baseItem.command = core.ToolboxState.ssoSignedIn
      ? core.CMD_SIGNOUT
      : core.CMD_SIGNIN;
    core.CommandManager.onAfterInvoke(core.CMD_SIGNIN, () => {
      this._baseItem.text = "$(sign-out) Sign Out";
      this._baseItem.command = core.CMD_SIGNOUT;
    });
    core.CommandManager.onAfterInvoke(core.CMD_SIGNOUT, () => {
      this._baseItem.text = "$(sign-in) TC Sign In";
      this._baseItem.command = core.CMD_SIGNIN;
    });
    this._baseItem.show();
  }
}
exports.SSOButton = SSOButton;
