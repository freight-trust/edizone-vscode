"use strict";
var core = require("../core.module");
var SSOButton = /** @class */ (function () {
  function SSOButton() {
    this._baseItem = null;
  }
  SSOButton.prototype.activate = function (baseItem) {
    var _this = this;
    this._baseItem = baseItem;
    this._baseItem.text = core.ToolboxState.ssoSignedIn
      ? "$(sign-out) Sign Out"
      : "$(sign-in) TC Sign In";
    this._baseItem.command = core.ToolboxState.ssoSignedIn
      ? core.CMD_SIGNOUT
      : core.CMD_SIGNIN;
    core.CommandManager.onAfterInvoke(core.CMD_SIGNIN, function () {
      _this._baseItem.text = "$(sign-out) Sign Out";
      _this._baseItem.command = core.CMD_SIGNOUT;
    });
    core.CommandManager.onAfterInvoke(core.CMD_SIGNOUT, function () {
      _this._baseItem.text = "$(sign-in) TC Sign In";
      _this._baseItem.command = core.CMD_SIGNIN;
    });
    this._baseItem.show();
  };
  return SSOButton;
})();
exports.SSOButton = SSOButton;
