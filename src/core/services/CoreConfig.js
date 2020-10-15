"use strict";
const vsc = require("vscode");
const CFG_SECTION = "toolkit.core";
class CoreConfig {
  static get ssoActiveTokenUri() {
    return vsc.workspace.getConfiguration(CFG_SECTION).get("ssoActiveTokenUri");
  }
  static get ssoClientId() {
    return vsc.workspace.getConfiguration(CFG_SECTION).get("ssoClientId");
  }
}
exports.CoreConfig = CoreConfig;
