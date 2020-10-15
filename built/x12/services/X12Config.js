"use strict";
var vsc = require("vscode");
var CFG_SECTION = "toolkit.x12";
var X12Config = /** @class */ (function () {
  function X12Config() {}
  Object.defineProperty(X12Config, "eppServiceUri", {
    get: function () {
      return vsc.workspace.getConfiguration(CFG_SECTION).get("eppServiceUri");
    },
    enumerable: true,
    configurable: true,
  });
  Object.defineProperty(X12Config, "formatX12OnOpen", {
    get: function () {
      return vsc.workspace.getConfiguration(CFG_SECTION).get("formatX12OnOpen");
    },
    enumerable: true,
    configurable: true,
  });
  return X12Config;
})();
exports.X12Config = X12Config;
