"use strict";
var vsc = require("vscode");
var CFG_SECTION = "toolkit.core";
var CoreConfig = /** @class */ (function () {
  function CoreConfig() {}
  Object.defineProperty(CoreConfig, "ssoActiveTokenUri", {
    get: function () {
      return vsc.workspace
        .getConfiguration(CFG_SECTION)
        .get("ssoActiveTokenUri");
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(CoreConfig, "ssoClientId", {
    get: function () {
      return vsc.workspace.getConfiguration(CFG_SECTION).get("ssoClientId");
    },
    enumerable: true,
    configurable: true,
  });
  return CoreConfig;
})();
exports.CoreConfig = CoreConfig;
