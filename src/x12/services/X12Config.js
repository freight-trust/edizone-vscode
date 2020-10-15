"use strict";
const vsc = require("vscode");
const CFG_SECTION = "toolkit.x12";
class X12Config {
  static get eppServiceUri() {
    return vsc.workspace.getConfiguration(CFG_SECTION).get("eppServiceUri");
  }
  static get formatX12OnOpen() {
    return vsc.workspace.getConfiguration(CFG_SECTION).get("formatX12OnOpen");
  }
}
exports.X12Config = X12Config;
