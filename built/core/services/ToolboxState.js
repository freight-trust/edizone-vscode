"use strict";
var core = require("../core.module");
var ToolboxState = /** @class */ (function () {
  function ToolboxState() {}
  Object.defineProperty(ToolboxState, "ssoToken", {
    get: function () {
      return core.GlobalState.get("sso_token");
    },
    set: function (token) {
      core.GlobalState.update("sso_token", token);
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ToolboxState, "ssoEmail", {
    get: function () {
      return core.GlobalState.get("sso_email");
    },
    set: function (email) {
      core.GlobalState.update("sso_email", email);
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(ToolboxState, "ssoSignedIn", {
    get: function () {
      return typeof this.ssoToken === "string";
    },
    enumerable: true,
    configurable: true,
  });
  return ToolboxState;
})();
exports.ToolboxState = ToolboxState;
