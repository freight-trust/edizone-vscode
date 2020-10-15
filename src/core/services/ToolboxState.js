"use strict";
const core = require("../core.module");
class ToolboxState {
  static get ssoToken() {
    return core.GlobalState.get("sso_token");
  }
  static set ssoToken(token) {
    core.GlobalState.update("sso_token", token);
  }
  static get ssoEmail() {
    return core.GlobalState.get("sso_email");
  }
  static set ssoEmail(email) {
    core.GlobalState.update("sso_email", email);
  }
  static get ssoSignedIn() {
    return typeof this.ssoToken === "string";
  }
}
exports.ToolboxState = ToolboxState;
